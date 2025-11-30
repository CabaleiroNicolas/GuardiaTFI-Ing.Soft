import { Afiliado } from "../../domain/value-objects/afiliado.vo";

export const AFILIADO_REPOSITORIO = Symbol('AFILIADO_REPOSITORIO');

export interface IAfiliadoRepository {
    modificar(afiliado: Afiliado): Promise<void>;
    obtener(numeroAfiliado: string): Promise<Afiliado | null>;
    obtenerTodos(): Promise<Afiliado[]>;
    registrar(afiliado: Afiliado): Promise<void>;
}