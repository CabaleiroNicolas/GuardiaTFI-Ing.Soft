import { UserRole } from "./value-objects/user-role.enum";

export class User {

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }

    userId: number;
    email: string;
    password?: string;
    role: UserRole;

}