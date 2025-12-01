import { Afiliado } from "../value-objects/afiliado.vo";
import { Domicilio } from "../value-objects/domicilio.vo";

export class Paciente {

  private id?: number;
  private cuil: string;
  private apellido: string;
  private nombre: string;
  private domicilio: Domicilio;
  private obraSocial: Afiliado | null;

  constructor(cuil: string, apellido: string, nombre: string, domicilio: Domicilio, obraSocial: Afiliado | null, id?: number) {
    this.id = id;
    this.cuil = cuil;
    this.apellido = apellido;
    this.nombre = nombre;
    this.domicilio = domicilio;
    this.obraSocial = obraSocial;
  }

  getCuil(): string {
    return this.cuil;
  }

  getId(): number | undefined {
    return this.id;
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

  getObraSocial(): Afiliado | null {
    return this.obraSocial;
  }


}