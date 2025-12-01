export enum UserRole {
    ENFERMERA = 'ENFERMERA',
    MEDICO = 'MEDICO',
}

export class UserRoleHelper {
    
  static userRoleFromString(userRoleStr: string): UserRole {

    switch (userRoleStr) {
      case 'ENFERMERA':
        return UserRole.ENFERMERA;
      case 'MEDICO':
        return UserRole.MEDICO;
      default:
        throw new Error(`Rol inválido: "${userRoleStr}"`);
    }
  }

}