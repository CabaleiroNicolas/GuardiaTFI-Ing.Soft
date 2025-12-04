import { Inject, Injectable } from "@nestjs/common";
import { IObraSocialRepository } from "../application/ports/obra-social-repository.interface";
import { ObraSocial } from "../domain/entities/obra-social.entity";
import { Pool } from "pg";

@Injectable()
export class ObraSocialRepositoryPg implements IObraSocialRepository {

  constructor(
      @Inject('PG_POOL')
      private readonly pool: Pool
    ) { }

  modificar(obraSocial: ObraSocial): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async obtener(nombre: string): Promise<ObraSocial | null> {
    const result = await this.pool.query("SELECT * FROM obras_sociales WHERE nombre = $1", [nombre]);

    const obraSocial = this.construirObraSocial(result.rows[0]);
    console.log("Result obra social: " + JSON.stringify(obraSocial));

    return obraSocial;
  }

  async obtenerTodos(): Promise<ObraSocial[]> {
    throw new Error("Method not implemented.");
  }

  async registrar(obraSocial: ObraSocial): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private construirObraSocial(r: any) : ObraSocial | null {
    
    if (!r) return null;

    return new ObraSocial(r.id, r.nombre);
  }
}