import { IEnfermeraRepository } from "src/modules/urgencias/application/ports/enfermera-repository.interface";
import { IEnfermeraService } from "src/modules/urgencias/application/ports/enfermera-service.interface";
import { Enfermera } from "src/modules/urgencias/domain/entities/enfermera.entity";

export class EnfermeraServiceMock implements IEnfermeraService {

  constructor(private readonly repo : IEnfermeraRepository) {}

  registrar(enfermera: Enfermera): void {
    this.repo.guardar(enfermera);
  }

  async buscarPorId(enfermeraId: number): Promise<Enfermera> {
    return (await this.repo.buscarPorId(enfermeraId))!;
  }
}