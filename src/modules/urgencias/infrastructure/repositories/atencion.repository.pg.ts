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

    async registrarAtencion(atencion: Atencion): Promise<void> {
        const query = `INSERT INTO atenciones (informe, medico_id, fecha_atencion) VALUES ($1, $2, $3) RETURNING id`;
        return await this.pool.query(query, [atencion.getInforme(), atencion.getMedico().getId(), atencion.getFechaAtencion()]);
    }
    
}
