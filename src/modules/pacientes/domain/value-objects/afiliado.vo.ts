import { ObraSocial } from "../../../pacientes/domain/entities/obra-social.entity";

export interface Afiliado{
  obraSocial: ObraSocial,
  numeroAfiliado: string
}