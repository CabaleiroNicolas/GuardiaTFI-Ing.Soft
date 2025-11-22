import { Afiliado } from "../../domain/value-objects/afiliado.vo";

export const AFILIADO_SERVICIO = Symbol('AFILIADO_SERVICIO');

export interface IAfiliadoService {
    buscar(numeroAfiliado: string): Afiliado | null;
    modificar(afiliado: Afiliado): boolean;
    registrar(afiliado: Afiliado): void;
}