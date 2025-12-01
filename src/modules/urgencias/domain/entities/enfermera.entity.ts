import { User } from "src/modules/user/domain/user.entity";
import { UserRole } from "src/modules/user/domain/value-objects/user-role.enum";

export class Enfermera extends User{

  private cuil: string;
  private apellido: string;
  private nombre: string;
  private matricula: string;

  constructor(userId: number, email: string, password: string, role: UserRole, cuil: string, apellido: string, nombre: string, matricula: string) {
    super(userId, email, password, role);
    this.cuil = cuil;
    this.apellido = apellido;
    this.nombre = nombre;
    this.matricula = matricula;
  }

  getCuil(): string {
    return this.cuil;
  }

  getApellido(): string {
    return this.apellido;
  }
    
  getNombre(): string {
    return this.nombre;
  }

  getMatricula(): string {
    return this.matricula;
  }
}