import { Paciente } from "../../domain/entities/paciente.entity";

export const PACIENTE_SERVICIO = Symbol('PACIENTE_SERVICIO');

export interface IPacienteService {
  buscar(dni: string): Paciente | null;
  comprobarCampos(paciente: Paciente): void;
  modificar(paciente: Paciente): boolean;
  obtenerPacientesRegistrados(): Paciente[];
  registrar(paciente: Paciente): void;
}