import { Afiliado } from "../../domain/value-objects/afiliado.vo";

export interface IAfiliadoService {
    buscar(numeroAfiliado: string): Afiliado | null;
    modificar(afiliado: Afiliado): boolean;
    registrar(afiliado: Afiliado): void;
}