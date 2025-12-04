import { Inject, Injectable } from "@nestjs/common";
import { IPacienteRepository } from "../application/ports/paciente-repository.interface";
import { Paciente } from "../domain/entities/paciente.entity";
import { Pool } from "pg";
import { ObraSocial } from "../domain/entities/obra-social.entity";
import { Afiliado } from "../domain/value-objects/afiliado.vo";
import { Domicilio } from "../domain/value-objects/domicilio.vo";

@Injectable()
export class PacienteRepositoryPg implements IPacienteRepository {

  constructor(
    @Inject('PG_POOL')
    private readonly pool: Pool
  ) { }

  modificar(paciente: Paciente): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async obtener(cuil: string): Promise<Paciente | null> {
    const result = await this.pool.query(`
      SELECT p.id, p.cuil, p.nombre, p.apellido, 
      p.calle, p.numero_direccion, p.localidad, 
      p.numero_afiliado, p.obra_social_id, os.nombre as nombre_obra
      FROM pacientes p 
      LEFT JOIN obras_sociales os 
      ON p.obra_social_id = os.id 
      WHERE p.cuil = $1`, [cuil]);
    
    const paciente = this.construirPaciente(result);

    console.log("Result paciente: " + JSON.stringify(paciente))
    
    return paciente;
  }

  async obtenerTodos(): Promise<Paciente[]> {
    const result = await this.pool.query(`SELECT p.id, p.cuil, p.nombre, p.apellido, 
      p.calle, p.numero_direccion, p.localidad, 
      p.numero_afiliado, p.obra_social_id, os.nombre AS obra_social 
      FROM pacientes p 
      INNER JOIN obras_sociales os 
      ON p.obra_social_id = os.id`);

    let pacientes: Paciente[] = [];

    result.rows.forEach(r => {
      const paciente = this.construirPaciente(r);
      if (paciente) {
      pacientes.push(paciente);
      }
    });

    return pacientes;
  }

  async registrar(paciente: Paciente): Promise<void> {

    const query = `INSERT INTO pacientes 
    (cuil, nombre, apellido, calle, numero_direccion, localidad, numero_afiliado, obra_social_id) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;

    const domicilio = paciente.getDomicilio();
    const afiliado = paciente.getObraSocial();

    await this.pool.query(query, [
      paciente.getCuil(),
      paciente.getNombre(),
      paciente.getApellido(),
      domicilio.calle,
      domicilio.numero,
      domicilio.localidad,
      afiliado?.numeroAfiliado,
      afiliado?.obraSocial.getId()
    ]);

    console.log("Paciente registrado Exitosamente");
  }

  private construirPaciente(r: any): Paciente | null {

    if(!r.rows || r.rows.length === 0){
      return null
    }

    const result = r.rows[0];

    const domicilio: Domicilio = {
      calle: result.calle,
      numero: result.numero_direccion,
      localidad: result.localidad
    };

    const obraSocial = new ObraSocial(r.obra_social_id, r.nombre_obra);

    const afiliado: Afiliado = {
      numeroAfiliado: r.numero_afiliado,
      cuil: r.cuil,
      obraSocial
    };

    return new Paciente(result.cuil, result.apellido, result.nombre, domicilio, afiliado, result.id);
  }
}