
import { Ingreso } from "../../domain/entities/ingreso.entity";
import { RegistrarIngresoDto } from "../../domain/value-objects/registrar-ingreso.dto";

export const INGRESO_SERVICIO = Symbol('INGRESO_SERVICIO');

export interface IIngresoService {
  registrar(ingreso: RegistrarIngresoDto, enfermeraId: number): Promise<void>;
  obtenerIngresosEnEspera(): Promise<Ingreso[]>;
  reclamarPaciente(): Promise<Ingreso>;
  traerUltimoReclamado(): Promise<Ingreso>;
  marcarAtendido(ingresoId: number, atencionId: number): Promise<void>;
}