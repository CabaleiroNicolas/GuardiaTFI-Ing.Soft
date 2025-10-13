export class Domicilio {
  calle: string;
  numero: number;
  localidad: string;

  constructor(calle: string, numero: number, localidad: string) {
    this.calle = calle;
    this.numero = numero;
    this.localidad = localidad;
  }
}