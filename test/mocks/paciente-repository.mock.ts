import { IPacienteRepository } from "src/modules/pacientes/application/ports/paciente-repository.interface";
import { Paciente } from "src/modules/pacientes/domain/entities/paciente.entity";

export class PacienteRepositoryMock implements IPacienteRepository {
  
  private pacientesRegistrados: Paciente[] = [];

  modificar(paciente: Paciente): boolean {
    throw new Error("No implementado");
  }

  obtener(cuil: string): Paciente | null {
    const paciente: Paciente | undefined = this.pacientesRegistrados.find(p => p.getCuil() == cuil);
    if(!paciente)return null;
    return paciente;
  }

  obtenerTodos(): Paciente[] {
    return this.pacientesRegistrados;
  }

  registrar(paciente: Paciente): boolean {
    this.pacientesRegistrados.push(paciente);
    return true;
  }
}