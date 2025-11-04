import { ObraSocial } from "../../domain/entities/obra-social.entity";

export interface IObraSocialService {
  buscar(id: string): ObraSocial | null;
  modificar(obraSocial: ObraSocial): boolean;
  registrar(obraSocial: ObraSocial): boolean;
}