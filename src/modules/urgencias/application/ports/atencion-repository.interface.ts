import { Atencion } from "../../domain/entities/atencion.entity";

export const ATENCION_REPOSITORIO = Symbol('ATENCION_REPOSITORIO');

export interface IAtencionRepository {

    registrarAtencion(atencion: Atencion): Promise<void>;
}