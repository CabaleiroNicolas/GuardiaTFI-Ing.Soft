export enum NivelEmergencia {
  CRITICO = "Critico",
  EMERGENCIA = "Emergencia",
  URGENCIA = "Urgencia",
  URGENCIA_MENOR = "Urgencia Menor",
  SIN_URGENCIA = "Sin Urgencia"
}


export class NivelEmergenciaHelper {
  static nivelEmergenciaFromString(nivelEmergenciaStr: string): NivelEmergencia {

    switch (nivelEmergenciaStr) {
      case 'Critico':
        return NivelEmergencia.CRITICO;
      case 'CRITICO':
        return NivelEmergencia.CRITICO;
      case 'Emergencia':
        return NivelEmergencia.EMERGENCIA;
      case 'EMERGENCIA':
        return NivelEmergencia.EMERGENCIA;
      case 'Urgencia':
        return NivelEmergencia.URGENCIA;
      case 'URGENCIA':
        return NivelEmergencia.URGENCIA;
      case 'Urgencia Menor':
        return NivelEmergencia.URGENCIA_MENOR;
      case 'URGENCIA_MENOR':
        return NivelEmergencia.URGENCIA_MENOR;
      case 'SIN_URGENCIA':
        return NivelEmergencia.SIN_URGENCIA;
      case 'Sin Urgencia':
        return NivelEmergencia.SIN_URGENCIA;
      default:
        throw new Error(`Nivel de emergencia inválido: "${nivelEmergenciaStr}"`);
    }
  }

}