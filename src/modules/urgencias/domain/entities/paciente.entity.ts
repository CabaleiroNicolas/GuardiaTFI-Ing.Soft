import { Domicilio } from "../value-objects/domicilio.vo";

export class Paciente {

  private cuil: string;
  private apellido: string;
  private nombre: string;
  private domicilio: Domicilio;

  constructor(cuil: string, apellido: string, nombre: string, domicilio: Domicilio) {
    this.cuil = cuil;
    this.apellido = apellido;
    this.nombre = nombre;
    this.domicilio = domicilio;
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

  getDomicilio(): Domicilio {
    return this.domicilio;
  }
}