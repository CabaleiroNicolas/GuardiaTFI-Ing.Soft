import { Paciente } from "../../domain/entities/paciente.entity";

export const PACIENTE_SERVICIO = Symbol('PACIENTE_SERVICIO');

export interface IPacienteService {
  buscar(dni: string): Promise<Paciente | null>;
  comprobarCampos(paciente: Paciente): Promise<void>;
  modificar(paciente: Paciente): Promise<void>;
  obtenerPacientesRegistrados(): Promise<Paciente[]>;
  registrar(paciente: Paciente): Promise<void>;
}