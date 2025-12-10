import { Inject, Injectable } from "@nestjs/common";
import { ObraSocial } from "../../domain/entities/obra-social.entity";
import { IObraSocialRepository, OBRASOCIAL_REPOSITORIO } from "../ports/obra-social-repository.interface";
import { IObraSocialService } from "../ports/obra-social-service.interface";

@Injectable()
export class ObraSocialService implements IObraSocialService {

  constructor(
    @Inject(OBRASOCIAL_REPOSITORIO)
    private readonly obraSocialRepo: IObraSocialRepository
  ) { }

  async obtenerObrasSociales(): Promise<string[]> {
    return await this.obraSocialRepo.obtenerNombres();
  }
  
  async buscar(nombre: string): Promise<ObraSocial | null> {
    return this.obraSocialRepo.obtener(nombre);
  }

  async modificar(obraSocial: ObraSocial): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async registrar(obraSocial: ObraSocial): Promise<void> {
    throw new Error("Method not implemented.");
  }
}