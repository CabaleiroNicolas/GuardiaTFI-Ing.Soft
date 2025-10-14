export enum NivelEmergencia {
  CRITICO = "Critica",
  EMERGENCIA = "Emergencia",
  URGENCIA = "Urgencia",
  URGENCIA_MENOR = "Urgencia Menor",
  SIN_URGENCIA = "Sin Urgencia"
}


export class NivelEmergenciaHelper {
  static nivelEmergenciaFromString(raw: string): NivelEmergencia {
    const norm = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
      .trim()
      .toUpperCase();;

    switch (norm) {
      case 'CRITICO':
      case 'CRÍTICO': // por si acaso
        return NivelEmergencia.CRITICO;
      case 'EMERGENCIA':
        return NivelEmergencia.EMERGENCIA;
      case 'URGENCIA':
        return NivelEmergencia.URGENCIA;
      case 'URGENCIA MENOR':
      case 'URGENCIAMENOR':
        return NivelEmergencia.URGENCIA_MENOR;
      case 'SIN URGENCIA':
      case 'SINURGENCIA':
        return NivelEmergencia.SIN_URGENCIA;
      default:
        throw new Error(`Nivel de emergencia inválido: "${raw}"`);
    }
  }
}