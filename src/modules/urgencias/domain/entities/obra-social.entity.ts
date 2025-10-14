export class ObraSocial {

  private id: string;
  private nombre: string;


  constructor(id: string, nombre: string) {
    
    this.nombre = nombre;
    this.id = id;
  }

  getId(): string{
    return this.id;
  }

  getNombre(): string{
    return this.nombre;
  }
}