import { TensionArterial } from "./tension-arterial.vo";

export interface SignosVitales {
  temperatura?: number;
  frecCardiaca?: number;
  frecRespiratoria?: number;
  tensionArterial?: TensionArterial;

  // constructor(temperatura?: number, frecCardiaca?: number, frecRespiratoria?: number, tensionArterial?: TensionArterial) {
  //   this.temperatura = temperatura;
  //   this.frecCardiaca = frecCardiaca;
  //   this.frecRespiratoria = frecRespiratoria;
  //   this.tensionArterial = tensionArterial;
  // }
}