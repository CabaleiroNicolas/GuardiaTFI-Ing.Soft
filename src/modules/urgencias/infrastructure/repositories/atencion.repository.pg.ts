import { Inject, Injectable } from "@nestjs/common";
import { IAtencionRepository } from "../../application/ports/atencion-repository.interface";
import { Atencion } from "../../domain/entities/atencion.entity";
import { Pool } from "pg";
import { AtencionDto } from "../../domain/value-objects/atencion.dto";

@Injectable()
export class AtencionRepositoryPg implements IAtencionRepository {

    constructor(
        @Inject('PG_POOL')
        private readonly pool: Pool
    ) { }

    async obtenerAtenciones(): Promise<AtencionDto[]> {
        const query = `SELECT
            a.id,
            a.informe,
            u_med.nombre AS medico_nombre,
            u_med.apellido AS medico_apellido,
            u_enf.nombre AS enfermera_nombre,
            u_enf.apellido AS enfermera_apellido,
            (a.fecha_atencion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires') AS fecha_atencion,
            p.nombre AS paciente_nombre,
            p.apellido AS paciente_apellido,
            p.cuil AS paciente_cuil
        FROM
            atenciones a
        INNER JOIN
            usuarios u_med ON a.medico_id = u_med.id
        INNER JOIN
            ingresos i ON i.atencion_id = a.id
        INNER JOIN
            usuarios u_enf ON i.enfermera_id = u_enf.id
        INNER JOIN 
        pacientes p ON i.paciente_id = p.id
        ORDER BY fecha_atencion DESC;`;
        const queryResult = (await this.pool.query(query)).rows;

        return queryResult.map(row => ({
            id: row.id,
            informe: row.informe,
            medico_nombre: row.medico_nombre,
            medico_apellido: row.medico_apellido,
            enfermera_nombre: row.enfermera_nombre,
            enfermera_apellido: row.enfermera_apellido,
            paciente_nombre: row.paciente_nombre,
            paciente_apellido: row.paciente_apellido,
            paciente_cuil: row.paciente_cuil,
            fecha_atencion: row.fecha_atencion,
        } as AtencionDto));

    }

    async registrarAtencion(atencion: Atencion): Promise<number> {
        const query = `INSERT INTO atenciones (informe, medico_id) VALUES ($1, $2) RETURNING id`;
        const result = await this.pool.query(query, [atencion.getInforme(), atencion.getMedico().getId()]);
        return result.rows[0].id;
    }

}
