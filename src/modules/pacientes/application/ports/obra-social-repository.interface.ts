import { ObraSocial } from "../../domain/entities/obra-social.entity";

export const OBRASOCIAL_REPOSITORIO = Symbol('OBRASOCIAL_REPOSITORIO');

export interface IObraSocialRepository {
  obtenerNombres(): string[] | PromiseLike<string[]>;
  modificar(obraSocial: ObraSocial): Promise<void>;
  obtener(nombre: string): Promise<ObraSocial | null>;
  obtenerTodos(): Promise<ObraSocial[]>;
  registrar(obraSocial: ObraSocial): Promise<void>;
}