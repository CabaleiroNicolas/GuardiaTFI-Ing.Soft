import { IIngresoRepository } from "src/modules/urgencias/application/ports/ingreso-repository.interface";
import { Ingreso } from "src/modules/urgencias/domain/entities/ingreso.entity";
import { EstadoIngreso } from "src/modules/urgencias/domain/value-objects/estado-ingreso.vo";

export class IngresoRepositoryMock implements IIngresoRepository {
  
  private ingresosEnEspera: Ingreso[] = [];

  modificar(ingreso: Ingreso): boolean {
    throw new Error("No implementado");
  }

  obtenerTodos(estado: EstadoIngreso = EstadoIngreso.PENDIENTE): Ingreso[] {
    return this.ingresosEnEspera.filter(i => i.estado == estado);
  }

  registrar(ingreso: Ingreso): boolean {
    this.ingresosEnEspera.push(ingreso);
    return true;
  }
}