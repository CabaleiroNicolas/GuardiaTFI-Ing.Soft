import { ObraSocial } from "../../domain/entities/obra-social.entity";

export const OBRASOCIAL_SERVICIO = Symbol('OBRASOCIAL_SERVICIO');

export interface IObraSocialService {
  buscar(id: string): Promise<ObraSocial | null>;
  modificar(obraSocial: ObraSocial): Promise<void>;
  registrar(obraSocial: ObraSocial): Promise<void>;
}