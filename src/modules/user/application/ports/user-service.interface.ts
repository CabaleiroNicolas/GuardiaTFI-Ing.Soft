import { User } from "../../domain/user.entity";

export const USUARIO_SERVICIO = Symbol('USER_SERVICE');

export interface IUserService {
    findWithPasswordByEmail(email: string): Promise<User | null>;
    createUser(email: string, password: string);
    confirmUser(token: string): Promise<void>;
    findByEmail(email: string): Promise<Omit<User, 'password'> | null>;

}