export class Paciente {
  cuil: string;
  apellido: string;
  nombre: string;
  domicilio: {
    calle: string,
    numero: number,
    localidad: string
  }

  constructor(cuil: string, apellido: string, nombre: string, calle: string, numero: number, localidad: string) {
    this.cuil = cuil;
    this.apellido = apellido;
    this.nombre = nombre;
    this.domicilio.calle = calle;
    this.domicilio.numero = numero;
    this.domicilio.localidad = localidad;
  }
}