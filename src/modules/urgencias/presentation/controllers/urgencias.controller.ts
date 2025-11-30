import { Controller, Get, Post, Body, Render, Inject, Redirect, Res } from '@nestjs/common';
import { IIngresoService, INGRESO_SERVICIO } from '../../application/ports/ingreso-service.interface';
import { IPacienteService, PACIENTE_SERVICIO } from 'src/modules/pacientes/application/ports/paciente-service.interface';
import { Enfermera } from '../../domain/entities/enfermera.entity';
import { SignosVitales } from '../../domain/value-objects/signos-vitales.vo';
import { Ingreso } from '../../domain/entities/ingreso.entity';
import { RegistrarIngresoDto } from '../../domain/value-objects/registrar-ingreso.dto';
import { NivelEmergencia } from '../../domain/value-objects/nivel-emergencia.enum';
import { mapIngresoToIngresoDto } from '../../application/mappers/ingreso.mapper';

@Controller('urgencias')
export class UrgenciasController {

  nivelesEmergencia = [
    { value: NivelEmergencia.CRITICO, descripcion: 'Critico' },
    { value: NivelEmergencia.EMERGENCIA, descripcion: 'Emergencia' },
    { value: NivelEmergencia.URGENCIA, descripcion: 'Urgencia' },
    { value: NivelEmergencia.URGENCIA_MENOR, descripcion: 'Urgencia Menor' },
    { value: NivelEmergencia.SIN_URGENCIA, descripcion: 'Sin Urgencia' },
  ];

  constructor(
    @Inject(INGRESO_SERVICIO)
    private readonly ingresoService: IIngresoService,
    @Inject(PACIENTE_SERVICIO)
    private readonly pacienteService: IPacienteService) { }


  @Post()
  async registrarIngreso(@Res() res, @Body() dto: RegistrarIngresoDto) {

    const enfermeraMock: Enfermera = new Enfermera("20-44444444-1", "Stoessel", "Martina", "34");
    const signosVitales: SignosVitales = {
      temperatura: dto.temperatura,
      frecCardiaca: dto.frecCardiaca,
      frecRespiratoria: dto.frecRespiratoria,
      tensionArterial: {
        frecSistolica: Number(dto.tensionArterial.split('/')[0]),
        frecDiastolica: Number(dto.tensionArterial.split('/')[1]),
      }
    };
    const fechaIngreso = new Date(Date.now());
    const nivelEmergencia = this.nivelesEmergencia.find(n => n.descripcion === dto.nivelEmergencia)?.value;

    console.log("nivelEmergencia enum " + nivelEmergencia);

    await this.ingresoService.registrar(dto, enfermeraMock);

    console.log("El ingreso fue registrado correctamente");

  }
}
