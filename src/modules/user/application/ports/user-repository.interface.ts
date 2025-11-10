import { User } from "../../domain/user.entity";

export const USER_REPOSITORIO = Symbol('USER_REPOSITORIO');

export interface IUserRepository {
    save(user: User): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
}