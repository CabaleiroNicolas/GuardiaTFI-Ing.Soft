import { Enfermera } from "../../domain/entities/enfermera.entity";

export const ENFERMERA_REPOSITORIO = Symbol('ENFERMERA_REPOSITORIO');

export interface IEnfermeraRepository {

    buscarPorId(enfermeraId: number): Promise<Enfermera | null>;
    guardar(enfermera: Enfermera): Promise<void>;
    obtenerTodos(): Promise<Enfermera[]>;
}