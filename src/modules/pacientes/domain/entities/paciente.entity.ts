import { Afiliado } from "../value-objects/afiliado.vo";
import { Domicilio } from "../value-objects/domicilio.vo";

export class Paciente {

  private cuil: string;
  private apellido: string;
  private nombre: string;
  private domicilio: Domicilio;
  private obraSocial: Afiliado | null;

  constructor(cuil: string, apellido: string, nombre: string, domicilio: Domicilio, obraSocial: Afiliado | null) {
    this.cuil = cuil;
    this.apellido = apellido;
    this.nombre = nombre;
    this.domicilio = domicilio;
    this.obraSocial = obraSocial;
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

   getObraSocial(): Afiliado {
    return this.obraSocial;
  }
}