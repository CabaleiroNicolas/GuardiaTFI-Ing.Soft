import { Ingreso } from "../../domain/entities/ingreso.entity";
import { IngresoDto } from "../../domain/value-objects/ingreso.dto";
import { NivelEmergencia, NivelEmergenciaHelper } from "../../domain/value-objects/nivel-emergencia.enum";

export function mapIngresoToIngresoDto(ingreso: Ingreso): IngresoDto {
  const paciente = ingreso.getPaciente();
  const nivelEmergencia = ingreso.getNivelEmergencia();
  const hora = ingreso.getFechaIngreso().toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  return {
    cuil: paciente.getCuil(),
    nombreCompleto: `${paciente.getApellido()}, ${paciente.getNombre()}`,
    hora,
    nivelEmergencia : NivelEmergenciaHelper.nivelEmergenciaToNumber(nivelEmergencia),
    nivelEmergenciaString: nivelEmergencia
  }
}