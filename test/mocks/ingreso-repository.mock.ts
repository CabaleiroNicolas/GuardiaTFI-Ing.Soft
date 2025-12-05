import { IIngresoRepository } from "src/modules/urgencias/application/ports/ingreso-repository.interface";
import { Ingreso } from "src/modules/urgencias/domain/entities/ingreso.entity";
import { EstadoIngreso } from "src/modules/urgencias/domain/value-objects/estado-ingreso.enum";

export class IngresoRepositoryMock implements IIngresoRepository {
  
  private ingresosEnEspera: Ingreso[] = [];

  async modificar(ingreso: Ingreso): Promise<void> {
    throw new Error("No implementado");
  }

  async obtenerTodos(estado: EstadoIngreso = EstadoIngreso.PENDIENTE): Promise<Ingreso[]> {
    return this.ingresosEnEspera.filter(i => i.getEstado() == estado);
  }

  async registrar(ingreso: Ingreso): Promise<void> {
    this.ingresosEnEspera.push(ingreso);
  }

  modificarEstado(ingresoId: number, nuevoEstado: EstadoIngreso): Promise<void> {
    throw new Error("Method not implemented.");
  }
}