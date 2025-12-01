import { Enfermera } from "../../domain/entities/enfermera.entity";
import { Ingreso } from "../../domain/entities/ingreso.entity";
import { RegistrarIngresoDto } from "../../domain/value-objects/registrar-ingreso.dto";

export const INGRESO_SERVICIO = Symbol('INGRESO_SERVICIO');

export interface IIngresoService {
  registrar(ingreso: RegistrarIngresoDto, enfermeraId: number): Promise<string>;
  obtenerIngresosEnEspera(): Promise<Ingreso[]>;
}