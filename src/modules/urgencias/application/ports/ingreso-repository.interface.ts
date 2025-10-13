import { Ingreso } from "../../domain/entities/ingreso.entity";
import { EstadoIngreso } from "../../domain/value-objects/estado-ingreso.vo";

export interface IIngresoRepository {
  modificar(ingreso: Ingreso): boolean;
  obtenerTodos(estado?: EstadoIngreso): Ingreso[];
  registrar(ingreso: Ingreso): boolean;
}