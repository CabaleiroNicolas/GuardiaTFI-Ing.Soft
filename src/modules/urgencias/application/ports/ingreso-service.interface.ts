import { Ingreso } from "../../domain/entities/ingreso.entity";

export interface IIngresoService {
  registrar(ingreso: Ingreso): string;
  obtenerIngresosEnEspera(): Ingreso[];
  comprobarCampos(ingreso: Ingreso): void;
}