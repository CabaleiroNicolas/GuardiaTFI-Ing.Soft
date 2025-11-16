import { Afiliado } from "../../domain/value-objects/afiliado.vo";

export interface IAfiliadoRepository {
    modificar(afiliado: Afiliado): boolean;
    obtener(numeroAfiliado: string): Afiliado | null;
    obtenerTodos(): Afiliado[];
    registrar(afiliado: Afiliado): void;
}