import { ObraSocial } from "../../domain/entities/obra-social.entity";

export const OBRASOCIAL_SERVICIO = Symbol('OBRASOCIAL_SERVICIO');

export interface IObraSocialService {
  buscar(id: string): ObraSocial | null;
  modificar(obraSocial: ObraSocial): boolean;
  registrar(obraSocial: ObraSocial): boolean;
}