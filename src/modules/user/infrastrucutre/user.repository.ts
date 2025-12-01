import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository } from "../application/ports/user-repository.interface";
import { User } from "../domain/user.entity";
import { UserRole, UserRoleHelper } from "../domain/value-objects/user-role.enum";
import { Pool } from "pg";
import { Enfermera } from "src/modules/urgencias/domain/entities/enfermera.entity";

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

        let result: any | null = null;

        const queryEnfermera = `SELECT cuil, email, password, role FROM enfermeras WHERE email = $1 LIMIT 1`;
        const queryMedico = `SELECT cuil, email, password, role FROM medicos WHERE email = $1 LIMIT 1`;

        result = await this.pool.query(queryEnfermera, [email]).rows[0];

        if (!result) {
            result = await this.pool.query(queryMedico, [email]).rows[0];
        }

        if (result) {

            if (result.role === 'ENFERMERA') {
                return new Enfermera(
                    result.id,
                    result.email,
                    result.password,
                    UserRoleHelper.userRoleFromString(result.role),
                    result.cuil,
                    result.apellido,
                    result.nombre,
                    result.matricula
                );
            }
            else if (result.role === 'MEDICO') {
                return new User()
            }
        }
        return null;
    }
    
}
