import { Inject, Injectable } from "@nestjs/common";
import { IAtencionRepository } from "../../application/ports/atencion-repository.interface";
import { Atencion } from "../../domain/entities/atencion.entity";
import { Pool } from "pg";

@Injectable()
export class AtencionRepositoryPg implements IAtencionRepository {

    constructor(
        @Inject('PG_POOL')
        private readonly pool: Pool
    ) { }

    async registrarAtencion(atencion: Atencion): Promise<number> {
        const query = `INSERT INTO atenciones (informe, medico_id) VALUES ($1, $2) RETURNING id`;
        const result = await this.pool.query(query, [atencion.getInforme(), atencion.getMedico().getId()]);
        return result.rows[0].id;
    }

}
