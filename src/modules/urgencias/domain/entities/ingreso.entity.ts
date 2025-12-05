import { Paciente } from "src/modules/pacientes/domain/entities/paciente.entity";
import { EstadoIngreso } from "../value-objects/estado-ingreso.enum";
import { NivelEmergencia } from "../value-objects/nivel-emergencia.enum";
import { SignosVitales } from "../value-objects/signos-vitales.vo";
import { Enfermera } from "./enfermera.entity";

export class Ingreso {
  
  private id?: number;
  private paciente: Paciente;
  private enfermera: Enfermera;
  private fechaIngreso: Date;
  private informe: string;
  private nivelEmergencia: NivelEmergencia;
  private signosVitales: SignosVitales;
  private estado: EstadoIngreso;

  constructor(paciente: Paciente, enfermera: Enfermera, fechaIngreso: Date, informe: string, nivelEmergencia: NivelEmergencia, signosVitales: SignosVitales, id?: number) {
    this.paciente = paciente;
    this.enfermera = enfermera;
    this.fechaIngreso = fechaIngreso;
    this.informe = informe;
    this.nivelEmergencia = nivelEmergencia;
    this.signosVitales = signosVitales;
    this.estado = EstadoIngreso.PENDIENTE;
    this.id = id;
  }

  getId(): number {
    return this.id!;
  }

  getPaciente(): Paciente {
    return this.paciente;
  }

  getEnfermera(): Enfermera {
    return this.enfermera;
  }

  getFechaIngreso(): Date {
    return this.fechaIngreso;
  }

  getInforme(): string {
    return this.informe;
  }

  getNivelEmergencia(): NivelEmergencia {
    return this.nivelEmergencia;
  }

  getSignosVitales(): SignosVitales {
    return this.signosVitales;
  }

  getEstado(): EstadoIngreso {
    return this.estado;
  }
}