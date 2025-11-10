import { User } from "../../domain/user.entity";

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
    save(user: User): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    update(conditions: Partial<User>, updateData: Partial<User>): Promise<void>;
}