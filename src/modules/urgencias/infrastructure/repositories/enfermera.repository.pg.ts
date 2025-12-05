import { Inject, Injectable } from "@nestjs/common";
import { IEnfermeraRepository } from "../../application/ports/enfermera-repository.interface";
import { Pool } from "pg";
import { Enfermera } from "../../domain/entities/enfermera.entity";
import { UserRoleHelper } from "src/modules/user/domain/value-objects/user-role.enum";

@Injectable()
export class EnfermeraRepositoryPg implements IEnfermeraRepository {

    constructor(
        @Inject('PG_POOL')
        private readonly pool: Pool
    ) { }

    async buscarPorId(enfermeraId: number): Promise<Enfermera | null> {

        let result: any | null = null;
        let enfermera: Enfermera | null = null;

        const queryEnfermera = `SELECT id, cuil, email, rol, matricula, apellido, nombre FROM usuarios WHERE id = $1 AND rol = 'ENFERMERA' LIMIT 1`;

        result = (await this.pool.query(queryEnfermera, [enfermeraId])).rows[0];

        if (result) {

            if (result.rol === 'ENFERMERA') {
                enfermera = new Enfermera(
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
        return enfermera;
    }


    guardar(enfermera: Enfermera): Promise<void> {
        throw new Error("Method not implemented.");
    }
    obtenerTodos(): Promise<Enfermera[]> {
        throw new Error("Method not implemented.");
    }

}