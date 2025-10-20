import { Enfermera } from "../../domain/entities/enfermera.entity";

export const ENFERMERA_SERVICE = Symbol('ENFERMERA_SERVICE');

export interface IEnfermeraService {

    registrar(enfermera: Enfermera): void;

}