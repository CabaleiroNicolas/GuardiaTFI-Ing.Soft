import { Inject, Injectable } from "@nestjs/common";
import { Afiliado } from "../../domain/value-objects/afiliado.vo";
import { AFILIADO_REPOSITORIO, IAfiliadoRepository } from "../ports/afiliado-repository.interface";
import { IAfiliadoService } from "../ports/afiliado-service.interface";

@Injectable()
export class AfiliadoService implements IAfiliadoService {

  constructor(
    @Inject(AFILIADO_REPOSITORIO)
    private readonly repo: IAfiliadoRepository) { }

  async buscar(numeroAfiliado: string): Promise<Afiliado | null> {
    return await this.repo.obtener(numeroAfiliado);
  }

  modificar(afiliado: Afiliado): Promise<void> {
    throw new Error("Method not implemented.");
  }

  registrar(afiliado: Afiliado): Promise<void> {
    throw new Error("Method not implemented.");
  }
}