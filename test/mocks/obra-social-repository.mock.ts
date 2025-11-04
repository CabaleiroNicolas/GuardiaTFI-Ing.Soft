import { IObraSocialRepository } from "src/modules/pacientes/application/ports/obra-social-repository.interface";
import { ObraSocial } from "src/modules/pacientes/domain/entities/obra-social.entity";

export class ObraSocialRepositoryMock implements IObraSocialRepository {

  private obrasSocialesRegistradas: ObraSocial[] = [];

  modificar(obraSocial: ObraSocial): boolean {
    throw new Error("No implementado");
  }

  obtener(id: string): ObraSocial | null {
    const obraSocial: ObraSocial | undefined = this.obrasSocialesRegistradas.find(os => os.getId() == id);

    if (!obraSocial) return null;
    
    return obraSocial;
  }

  obtenerTodos(): ObraSocial[] {
    return this.obrasSocialesRegistradas;
  }

  registrar(obraSocial: ObraSocial): boolean {
    this.obrasSocialesRegistradas.push(obraSocial);
    return true;
  }
}