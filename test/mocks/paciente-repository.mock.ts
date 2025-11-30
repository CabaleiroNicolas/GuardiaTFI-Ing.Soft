import { IPacienteRepository } from "src/modules/pacientes/application/ports/paciente-repository.interface";
import { Paciente } from "src/modules/pacientes/domain/entities/paciente.entity";

export class PacienteRepositoryMock implements IPacienteRepository {
  
  private pacientesRegistrados: Paciente[] = [];

  async modificar(paciente: Paciente): Promise<void> {
    throw new Error("No implementado");
  }

  async obtener(cuil: string): Promise<Paciente | null> {
    const paciente: Paciente | undefined = this.pacientesRegistrados.find(p => p.getCuil() == cuil);
    if(!paciente)return null;
    return paciente;
  }

  async obtenerTodos(): Promise<Paciente[]> {
    return this.pacientesRegistrados;
  }

  async registrar(paciente: Paciente): Promise<void> {
    this.pacientesRegistrados.push(paciente);
  }
}