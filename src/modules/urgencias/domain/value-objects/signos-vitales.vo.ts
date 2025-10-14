
export interface SignosVitales {
  temperatura: number;
  frecCardiaca: number;
  frecRespiratoria: number;
  tensionArterial: TensionArterial;
}

export interface TensionArterial {
  frecSistolica: number;
  frecDiastolica: number;
}