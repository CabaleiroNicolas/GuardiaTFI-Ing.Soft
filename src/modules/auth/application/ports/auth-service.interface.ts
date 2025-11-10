import { User } from "src/modules/user/domain/user.entity";


export const AUTH_SERVICIO = Symbol('AUTH_SERVICE');

export interface IAuthService {
    
    validateUser(email: string, rawPassword: string): Promise<any>;
    login(user: User): Promise<any>;
}