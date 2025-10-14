import { Paciente } from "../../domain/entities/paciente.entity";
import { IPacienteRepository } from "../ports/paciente-repository.interface";
import { IPacienteService } from "../ports/paciente-service.interface";

export class PacienteService implements IPacienteService {
  private pacienteRepo: IPacienteRepository;
  
    constructor(pacienteRepo: IPacienteRepository) {
      this.pacienteRepo = pacienteRepo;
    }
    
    buscar(cuil: string): Paciente | null {
      return this.pacienteRepo.obtener(cuil);
    }
  
    modificar(paciente: Paciente): boolean {
      throw new Error("No implementado");
    }
  
    obtenerPacientesRegistrados(): Paciente[] {
      return this.pacienteRepo.obtenerTodos();
    }
  
    registrar(paciente: Paciente): boolean {
      return this.pacienteRepo.registrar(paciente);
    }
}