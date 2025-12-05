import { Medico } from "./medico.entity"

export class Atencion {
    private informe: string;
    private medico: Medico;
    private fechaAtencion?: Date;

    constructor(informe: string, medico: Medico, fechaAtencion?: Date) {
        this.informe = informe;
        this.medico = medico;
        this.fechaAtencion = fechaAtencion;
    }

    getInforme(): string {
        return this.informe;
    }

    getMedico(): Medico {
        return this.medico;
    }

    getFechaAtencion(): Date | undefined {
        return this.fechaAtencion;
    }
} 