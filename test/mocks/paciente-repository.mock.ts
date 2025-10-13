import { IPacienteRepository } from "src/modules/urgencias/application/ports/paciente-repository.interface";
import { Paciente } from "src/modules/urgencias/domain/entities/paciente.entity";

export class PacienteRepositoryMock implements IPacienteRepository {
  
  private pacientesRegistrados: Paciente[] = [];

  modificar(paciente: Paciente): boolean {
    throw new Error("No implementado");
  }

  obtener(cuil: string): Paciente | null {
    return this.pacientesRegistrados.find(p => p.cuil === cuil) as Paciente | null;
  }

  obtenerTodos(): Paciente[] {
    return this.pacientesRegistrados;
  }

  registrar(paciente: Paciente): boolean {
    this.pacientesRegistrados.push(paciente);
    return true;
  }
}