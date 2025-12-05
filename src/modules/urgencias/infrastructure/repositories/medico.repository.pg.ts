import { Inject, Injectable } from "@nestjs/common";
import { IMedicoRepository } from "../../application/ports/medico-repository.interface";
import { Medico } from "../../domain/entities/medico.entity";
import { UserRoleHelper } from "src/modules/user/domain/value-objects/user-role.enum";
import { Pool } from "pg";

@Injectable()
export class MedicoRepositoryPg implements IMedicoRepository {

    constructor(
            @Inject('PG_POOL')
            private readonly pool: Pool
        ) { }
    

    async buscarPorId(medicoId: number): Promise<Medico | null> {

        let result: any | null = null;
        let medico: Medico | null = null;

        const queryMedico = `SELECT id, cuil, email, rol, matricula, apellido, nombre FROM usuarios WHERE id = $1 AND rol = 'MEDICO' LIMIT 1`;

        result = (await this.pool.query(queryMedico, [medicoId])).rows[0];
        if (result) {

            if (result.rol === 'MEDICO') {
                medico = new Medico(
                    result.id,
                    result.email,
                    "NoAvailable",
                    UserRoleHelper.userRoleFromString(result.rol),
                    result.cuil,
                    result.apellido,
                    result.nombre,
                    result.matricula
                );
            }

        }
        return medico;
    }
}