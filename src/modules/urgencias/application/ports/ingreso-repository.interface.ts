import { Ingreso } from "../../domain/entities/ingreso.entity";
import { EstadoIngreso } from "../../domain/value-objects/estado-ingreso.enum";

export const INGRESO_REPOSITORIO = Symbol('INGRESO_REPOSITORIO');

export interface IIngresoRepository {
  marcarAtendido(ingresoId: number, atencionId: number): Promise<void>;
  modificarEstado(ingresoId: number, nuevoEstado: EstadoIngreso): Promise<void>;
  obtenerTodos(estado: EstadoIngreso): Promise<Ingreso[]>;
  registrar(ingreso: Ingreso): Promise<void>;
}