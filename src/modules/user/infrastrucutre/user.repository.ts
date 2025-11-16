import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../application/ports/user-repository.interface";
import { User } from "../domain/user.entity";
import { UserRole } from "../domain/value-objects/user-role.enum";

@Injectable()
export class UserRepository implements IUserRepository {

    private users: User[] = [
        {
            userId: 1,
            email: 'test@example.com',
            password: '$2b$12$JWMFGf/U6A7o9I0RP1GpPuak.dld0uWau1b3VfIjLLdDL1q8igtEi', //password: test
            role: UserRole.MEDICO
        } as User];

    save(user: User): Promise<void> {
        this.users.push(user);
        console.log('User saved:', user);
        return Promise.resolve();
    }

    findByEmail(email: string): Promise<User | null> {
        return Promise.resolve(this.users.find(user => user.email === email) || null);
    }

    findLastUserId(): Promise<number> {
        const lastUser = this.users[this.users.length - 1];
        return Promise.resolve(lastUser ? lastUser.userId : 0);
    }
}