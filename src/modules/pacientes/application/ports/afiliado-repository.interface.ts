import { Afiliado } from "../../domain/value-objects/afiliado.vo";

export const AFILIADO_REPOSITORIO = Symbol('AFILIADO_REPOSITORIO');

export interface IAfiliadoRepository {
    modificar(afiliado: Afiliado): boolean;
    obtener(numeroAfiliado: string): Afiliado | null;
    obtenerTodos(): Afiliado[];
    registrar(afiliado: Afiliado): void;
}