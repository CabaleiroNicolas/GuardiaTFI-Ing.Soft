import { ObraSocial } from "../../domain/entities/obra-social.entity";

export const OBRASOCIAL_REPOSITORIO = Symbol('OBRASOCIAL_REPOSITORIO');

export interface IObraSocialRepository {
  modificar(obraSocial: ObraSocial): boolean;
  obtener(id: string): ObraSocial | null;
  obtenerTodos(): ObraSocial[];
  registrar(obraSocial: ObraSocial): boolean;
}