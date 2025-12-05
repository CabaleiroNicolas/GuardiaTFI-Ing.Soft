import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository } from "../application/ports/user-repository.interface";
import { User } from "../domain/user.entity";
import { UserRole, UserRoleHelper } from "../domain/value-objects/user-role.enum";
import { Pool } from "pg";
import { Enfermera } from "src/modules/urgencias/domain/entities/enfermera.entity";
import { Medico } from "src/modules/urgencias/domain/entities/medico.entity";

@Injectable()
export class UserRepository implements IUserRepository {

    constructor(
        @Inject('PG_POOL')
        private readonly pool: Pool
    ) { }


    save(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /* save(user: User): Promise<void> {
        this.users.push(user);
        console.log('User saved:', user);
        return Promise.resolve();
    } */

    async findByEmail(email: string): Promise<User | null> {
        console.log("buscando usuario por email en repo:", email);
        let result: any | null = null;
        let user: User | null = null;

        const query = `SELECT id, cuil, email, password_hash, rol, matricula, apellido, nombre FROM usuarios WHERE email = $1 LIMIT 1`;

        result = (await this.pool.query(query, [email])).rows[0];

        if (!result) {
            console.log("usuario no encontrado en repo");
            return null;
        }

        if (result.rol === UserRole.ENFERMERA) {
            user = new Enfermera(
                result.id,
                result.email,
                result.password_hash,
                UserRoleHelper.userRoleFromString(result.rol),
                result.cuil,
                result.apellido,
                result.nombre,
                result.matricula
            );
        } else if (result.rol === UserRole.MEDICO) {
             user = new Medico(
                result.id,
                result.email,
                result.password_hash,
                UserRoleHelper.userRoleFromString(result.rol),
                result.cuil,
                result.apellido,
                result.nombre,
                result.matricula
            );
        }

        console.log("usuario encontrado en repo:", user);
        return user;
    }

}
