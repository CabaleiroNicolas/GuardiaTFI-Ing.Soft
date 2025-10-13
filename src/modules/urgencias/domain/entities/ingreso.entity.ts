import { EstadoIngreso } from "../value-objects/estado-ingreso.vo";
import { NivelEmergencia } from "../value-objects/nivel-emergencia.vo";
import { SignosVitales } from "../value-objects/signos-vitales.vo";
import { Paciente } from "./paciente.entity";

export class Ingreso {
  paciente: Paciente;
  fechaIngreso: Date;
  informe: string;
  nivelEmergencia: NivelEmergencia;
  signosVitales: SignosVitales;
  estado: EstadoIngreso;

  constructor(paciente: Paciente, fechaIngreso: Date, informe: string, nivelEmergencia: NivelEmergencia, signosVitales: SignosVitales) {
    this.paciente = paciente;
    this.fechaIngreso = fechaIngreso;
    this.informe = informe;
    this.nivelEmergencia = nivelEmergencia;
    this.signosVitales = signosVitales;
    this.estado = EstadoIngreso.PENDIENTE;
  }
}