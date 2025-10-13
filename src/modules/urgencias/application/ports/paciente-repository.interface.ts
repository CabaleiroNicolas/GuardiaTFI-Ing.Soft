import { Paciente } from "../../domain/entities/paciente.entity";

export interface IPacienteRepository {
  modificar(paciente: Paciente): boolean;
  obtener(cuil: string): Paciente | null;
  obtenerTodos(): Paciente[];
  registrar(paciente: Paciente): boolean;
}