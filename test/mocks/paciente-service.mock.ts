import { IPacienteRepository } from "src/modules/pacientes/application/ports/paciente-repository.interface";
import { IPacienteService } from "src/modules/pacientes/application/ports/paciente-service.interface";
import { Paciente } from "src/modules/pacientes/domain/entities/paciente.entity";
import { Domicilio } from "src/modules/pacientes/domain/value-objects/domicilio.vo";
import { PacienteDto } from "src/modules/pacientes/domain/value-objects/paciente.dto";

export class PacienteServiceMock implements IPacienteService {
  

  constructor(private readonly repo: IPacienteRepository) { }

  async buscar(cuil: string): Promise<Paciente | null> {
    return await this.repo.obtener(cuil);
  }

  modificar(paciente: Paciente): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async obtenerPacientesRegistrados(): Promise<Paciente[]> {
    return await this.repo.obtenerTodos();
  }

  async registrar(dto: PacienteDto): Promise<void> {

    const domicilio: Domicilio = {
      calle: dto.calle,
      numero: dto.numero,
      localidad: dto.localidad
    };

    const paciente = new Paciente(dto.cuil, dto.apellido, dto.nombre, domicilio, null);

    return Promise.resolve(this.repo.registrar(paciente));
  }
}