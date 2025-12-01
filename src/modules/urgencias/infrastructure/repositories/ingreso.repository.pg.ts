import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { IIngresoRepository } from "../../application/ports/ingreso-repository.interface";
import { Ingreso } from "../../domain/entities/ingreso.entity";
import { EstadoIngreso } from "../../domain/value-objects/estado-ingreso.enum";
import { Paciente } from "src/modules/pacientes/domain/entities/paciente.entity";
import { Domicilio } from "src/modules/pacientes/domain/value-objects/domicilio.vo";
import { Afiliado } from "src/modules/pacientes/domain/value-objects/afiliado.vo";
import { ObraSocial } from "src/modules/pacientes/domain/entities/obra-social.entity";
import { Enfermera } from "../../domain/entities/enfermera.entity";
import { SignosVitales, TensionArterial } from "../../domain/value-objects/signos-vitales.vo";
import { UserRole } from "src/modules/user/domain/value-objects/user-role.enum";

@Injectable()
export class IngresoRepositoryPg implements IIngresoRepository {

  constructor(
    @Inject('PG_POOL')
    private readonly pool: Pool
  ) { }
  
  modificar(ingreso: Ingreso): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async obtenerTodos(estado?: EstadoIngreso): Promise<Ingreso[]> {
    const result = await this.pool.query(
      `SELECT i.id, i.fecha_ingreso, i.nivel_emergencia, i.estado, 
        p.cuil AS paciente_cuil, p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, 
        p.calle AS paciente_calle, p.numero_direccion, p.localidad as paciente_localidad, 
        p.numero_afiliado, p.obra_social_id, 
        informe, temperatura, frecuencia_cardiaca, frecuencia_respiratoria, tension_arterial, 
        e.nombre AS enfermera_nombre, e.apellido AS enfermera_apellido, 
        e.matricula AS enfermera_matricula, e.cuil AS enfermera_cuil
        FROM ingresos i 
        INNER JOIN pacientes p ON p.id = i.paciente_id 
        INNER JOIN enfermeras e ON e.id = i.enfermera_id 
        ORDER BY i.fecha_ingreso DESC`);

    let ingresos: Ingreso[] = [];
    
    result.rows.forEach(r => {
      const ingreso = this.construirIngreso(r);
      ingresos.push(ingreso);
    });

    return ingresos;
  }

  async registrar(ingreso: Ingreso): Promise<void> {
    const query = `INSERT INTO ingresos ( paciente_id, enfermera_id, informe, nivel_emergencia, temperatura, frecuencia_cardiaca, frecuencia_respiratoria, tension_arterial, estado) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;

    const signosVitales = ingreso.getSignosVitales();

    console.log(ingreso);

    await this.pool.query(query, [
      1,//ingreso.getPaciente().getId(),
      1,//ingreso.getEnfermera().userId,
      ingreso.getInforme(),
      ingreso.getNivelEmergencia(),
      signosVitales.temperatura,
      signosVitales.frecCardiaca,
      signosVitales.frecRespiratoria,
      `${signosVitales.tensionArterial.frecDiastolica}/${signosVitales.tensionArterial.frecSistolica}`,
      ingreso.getEstado()
    ]);
  }

  private construirIngreso(r: any): Ingreso {
    const domicilio: Domicilio = {
      calle: r.paciente_calle,
      numero: r.numero_direccion,
      localidad: r.paciente_localidad
    };
    const afiliado: Afiliado = {
      numeroAfiliado: r.numero_afiliado,
      obraSocial: new ObraSocial(r.obra_social_id, "")
    };

    const fechaIngreso = new Date(r.fecha_ingreso);
    const tensionArterial: TensionArterial = {
      frecDiastolica: r.tension_arterial.split('/')[0],
      frecSistolica: r.tension_arterial.split('/')[1]
    };
    const signosVitales: SignosVitales = {
      temperatura: r.temperatura,
      frecCardiaca: r.frecuencia_cardiaca,
      frecRespiratoria: r.frecuencia_respiratoria,
      tensionArterial
    };

    const paciente = new Paciente(r.paciente_cuil, r.paciente_apellido,
      r.paciente_nombre, domicilio, afiliado);

    const enfermera = new Enfermera(r.userId, "null", "null", UserRole.ENFERMERA, r.enfermera_cuil, r.enfermera_apellido,
      r.enfermera_nombre, r.enfermera_matricula);
      
    return new Ingreso(paciente, enfermera, fechaIngreso, r.informe, r.nivel_emergencia, signosVitales);
  }
}