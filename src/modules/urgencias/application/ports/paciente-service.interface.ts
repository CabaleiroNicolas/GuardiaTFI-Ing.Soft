import { Paciente } from "../../domain/entities/paciente.entity";

export interface IPacienteService {
  buscar(dni: string): Paciente | null;
  modificar(paciente: Paciente): boolean;
  obtenerPacientesRegistrados(): Paciente[];
  registrar(paciente: Paciente): boolean;
}