import { Medico } from "../../domain/entities/medico.entity";

export const MEDICO_SERVICIO = Symbol('MEDICO_SERVICIO');

export interface IMedicoService {
    buscarPorId(id: number): Promise<Medico>;
}