

export const INGRESO_REPOSITORIO = Symbol('AUTH_SERVICE');

export interface IAuthService {
    validateUser(email: string, rawPassword: string): Promise<any>;
    login(user: { userId: string; email: string }): Promise<{ access_token: string }>;
}