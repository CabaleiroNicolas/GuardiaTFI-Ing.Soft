import { Paciente } from "../../domain/entities/paciente.entity";

export const PACIENTE_REPOSITORIO = Symbol('PACIENTE_REPOSITORIO');

export interface IPacienteRepository {
  modificar(paciente: Paciente): Promise<void>;
  obtener(cuil: string): Promise<Paciente | null>;
  obtenerTodos(): Promise<Paciente[]>;
  registrar(paciente: Paciente): Promise<void>;
}