import { Paciente } from "../../domain/entities/paciente.entity";

export const PACIENTE_REPOSITORIO = Symbol('PACIENTE_REPOSITORIO');

export interface IPacienteRepository {
  modificar(paciente: Paciente): boolean; // Cambiar por promesa
  obtener(cuil: string): Paciente | null; // Cambiar por promesa
  obtenerTodos(): Paciente[]; // Cambiar por promesa
  registrar(paciente: Paciente): boolean; // Cambiar por promesa
}