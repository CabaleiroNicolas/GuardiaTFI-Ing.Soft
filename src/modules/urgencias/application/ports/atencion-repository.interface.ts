import { Atencion } from "../../domain/entities/atencion.entity";
import { AtencionDto } from "../../domain/value-objects/atencion.dto";

export const ATENCION_REPOSITORIO = Symbol('ATENCION_REPOSITORIO');

export interface IAtencionRepository {
    obtenerAtenciones(): Promise<AtencionDto[]>;
    registrarAtencion(atencion: Atencion): Promise<number>;
}