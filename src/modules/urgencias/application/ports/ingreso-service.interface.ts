import { Ingreso } from "../../domain/entities/ingreso.entity";

export const INGRESO_SERVICIO = Symbol('INGRESO_SERVICIO');

export interface IIngresoService {
  registrar(ingreso: Ingreso): Promise<string>;
  obtenerIngresosEnEspera(): Promise<Ingreso[]>;
  comprobarCampos(ingreso: Ingreso): void;
}