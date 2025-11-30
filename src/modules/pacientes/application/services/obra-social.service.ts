import { ObraSocial } from "../../domain/entities/obra-social.entity";
import { IObraSocialRepository } from "../ports/obra-social-repository.interface";
import { IObraSocialService } from "../ports/obra-social-service.interface";

export class ObraSocialService implements IObraSocialService {

  constructor(
    private readonly obraSocialRepo: IObraSocialRepository
  ) { }
  
  async buscar(id: string): Promise<ObraSocial | null> {
    return this.obraSocialRepo.obtener(id);
  }

  async modificar(obraSocial: ObraSocial): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async registrar(obraSocial: ObraSocial): Promise<void> {
    throw new Error("Method not implemented.");
  }
}