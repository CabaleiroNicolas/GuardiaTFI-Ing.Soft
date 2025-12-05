import { Medico } from "../../domain/entities/medico.entity";

export const MEDICO_REPOSITORIO = Symbol('MEDICO_REPOSITORIO');

export interface IMedicoRepository {
    buscarPorId(medicoId: number): Promise<Medico | null>;
}
