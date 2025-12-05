import { RegistrarAtencionDto } from "../../domain/value-objects/registrar-atencion.dto";

export const ATENCION_SERVICIO = Symbol('ATENCION_SERVICIO');

export interface IAtencionService {

  registrarAtencion(dto: RegistrarAtencionDto, userId: number): unknown;
}