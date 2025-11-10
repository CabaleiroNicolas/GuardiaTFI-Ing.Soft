import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../application/ports/user-repository.interface";
import { User } from "../domain/user.entity";
import { UserRole } from "../domain/value-objects/user-role.enum";

@Injectable()
export class UserRepository implements IUserRepository {

    private users: User[] = [{userId: 1, email: 'test@example.com', role: UserRole.ENFERMERA} as User];

    save(user: User): Promise<void> {
        this.users.push(user);
        return Promise.resolve();
    }
    
    findByEmail(email: string): Promise<User | null> {
        return Promise.resolve(this.users.find(user => user.email === email) || null);
    }
}