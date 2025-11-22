import { Afiliado } from "../../domain/value-objects/afiliado.vo";

export const AFILIADO_SERVICIO = Symbol('AFILIADO_SERVICIO');

export interface IAfiliadoService {
    buscar(numeroAfiliado: string): Promise<Afiliado | null>;
    modificar(afiliado: Afiliado): Promise<void>;
    registrar(afiliado: Afiliado): Promise<void>;
}