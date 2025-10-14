import { Paciente } from "../../domain/entities/paciente.entity";

export const PACIENTE_REPOSITORIO = Symbol('PACIENTE_REPOSITORIO');

export interface IPacienteRepository {
  modificar(paciente: Paciente): boolean;
  obtener(cuil: string): Paciente | null;
  obtenerTodos(): Paciente[];
  registrar(paciente: Paciente): boolean;
}