import { IUserRepository } from "../application/ports/user-repository.interface";
import { User } from "../domain/user.entity";

export class UserRepository implements IUserRepository {
    
    save(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    update(conditions: Partial<User>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    findByEmail(email: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
}