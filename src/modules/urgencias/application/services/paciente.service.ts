import { Inject, Injectable } from "@nestjs/common";
import { Paciente } from "../../domain/entities/paciente.entity";
import { IPacienteRepository, PACIENTE_REPOSITORIO } from "../ports/paciente-repository.interface";
import { IPacienteService } from "../ports/paciente-service.interface";

@Injectable()
export class PacienteService implements IPacienteService {
  
    constructor(
      @Inject(PACIENTE_REPOSITORIO)
      private readonly pacienteRepo: IPacienteRepository
    ) {}
    
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