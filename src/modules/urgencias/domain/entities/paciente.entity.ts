import { Domicilio } from "../value-objects/domicilio.vo";

export class Paciente {
  cuil: string;
  apellido: string;
  nombre: string;
  domicilio: Domicilio;

  constructor(cuil: string, apellido: string, nombre: string, domicilio: Domicilio) {
    this.cuil = cuil;
    this.apellido = apellido;
    this.nombre = nombre;
    this.domicilio = domicilio;
  }
}