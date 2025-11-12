export class Enfermera {

  private cuil: string;
  private apellido: string;
  private nombre: string;
  private matricula: string;

  constructor(cuil: string, apellido: string, nombre: string, matricula: string) {
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