import { Ingreso } from "../../domain/entities/ingreso.entity";
import { EstadoIngreso } from "../../domain/value-objects/estado-ingreso.enum";

export const INGRESO_REPOSITORIO = Symbol('INGRESO_REPOSITORIO');

export interface IIngresoRepository {
  modificar(ingreso: Ingreso): boolean;
  obtenerTodos(estado?: EstadoIngreso): Ingreso[];
  registrar(ingreso: Ingreso): boolean;
}