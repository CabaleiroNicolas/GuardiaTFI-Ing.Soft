import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { Afiliado } from "../../domain/value-objects/afiliado.vo";
import { IAfiliadoRepository } from "../../application/ports/afiliado-repository.interface";
import { ObraSocial } from "../../domain/entities/obra-social.entity";


@Injectable()
export class AfiliadoRepositoryPg implements IAfiliadoRepository {

  constructor(
      @Inject('PG_POOL')
      private readonly pool: Pool
    ) { }

  modificar(afiliado: Afiliado): Promise<void> {
    throw new Error("Method not implemented.");
  }

  
  async obtener(numeroAfiliado: string): Promise<Afiliado | null> {
    const result = await this.pool.query(`
      SELECT numero_afiliado, cuil, os.id, os.nombre FROM afiliados a 
      INNER JOIN obras_sociales os 
      ON a.obra_social_id = os.id 
      WHERE numero_afiliado = $1`, [numeroAfiliado]);

    const afiliado = this.construirAfiliado(result.rows[0]);
    
    console.log("Result afiliado: " + JSON.stringify(afiliado));
    
    return afiliado;
  }

  obtenerTodos(): Promise<Afiliado[]> {
    throw new Error("Method not implemented.");
  }

  registrar(afiliado: Afiliado): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private construirAfiliado(r: any): Afiliado | null {
    
    if (!r) return null;
    
    const obraSocial = new ObraSocial(r.id, r.nombre);

    return { numeroAfiliado: r.numero_afiliado, cuil: r.cuil, obraSocial };
  }
}