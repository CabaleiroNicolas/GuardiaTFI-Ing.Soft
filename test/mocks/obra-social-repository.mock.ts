import { IObraSocialRepository } from "src/modules/pacientes/application/ports/obra-social-repository.interface";
import { ObraSocial } from "src/modules/pacientes/domain/entities/obra-social.entity";

export class ObraSocialRepositoryMock implements IObraSocialRepository {

  private obrasSocialesRegistradas: ObraSocial[] = [];

  async modificar(obraSocial: ObraSocial): Promise<void> {
    throw new Error("No implementado");
  }

  async obtener(id: string): Promise<ObraSocial | null> {
    const obraSocial: ObraSocial | undefined = this.obrasSocialesRegistradas.find(os => os.getId() == id);

    if (!obraSocial) return null;
    
    return obraSocial;
  }

  async obtenerTodos(): Promise<ObraSocial[]> {
    return this.obrasSocialesRegistradas;
  }

  async registrar(obraSocial: ObraSocial): Promise<void> {
    this.obrasSocialesRegistradas.push(obraSocial);
  }
}