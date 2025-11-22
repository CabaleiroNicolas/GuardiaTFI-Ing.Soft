import { Controller, Get, Post, Body, Render, Inject, Redirect, Res } from '@nestjs/common';
import { IIngresoService, INGRESO_SERVICIO } from '../../application/ports/ingreso-service.interface';
import { IPacienteService, PACIENTE_SERVICIO } from 'src/modules/pacientes/application/ports/paciente-service.interface';
import { Enfermera } from '../../domain/entities/enfermera.entity';
import { SignosVitales } from '../../domain/value-objects/signos-vitales.vo';
import { Ingreso } from '../../domain/entities/ingreso.entity';
import { Paciente } from 'src/modules/pacientes/domain/entities/paciente.entity';
import { Domicilio } from 'src/modules/pacientes/domain/value-objects/domicilio.vo';
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

  @Get('listar')
  @Render('listar-ingresos')
  async listarIngresos() {
    const ingresos = await this.ingresoService.obtenerIngresosEnEspera();
    const ingresosDto = ingresos.map(mapIngresoToIngresoDto);

    return {
      layout: 'layouts/main',
      title: 'Listado de ingresos',
      ingresosDto,
    };
  }
  
  @Get('registrar')
  @Render('registrar-ingreso')
  mostrarFormularioRegistro() {
    return {
      layout: 'layouts/main',
      title: 'Registrar ingreso',
      niveles: this.nivelesEmergencia,
    };
  }

  @Post('registrar')
  async registrarIngreso(@Res() res, @Body() dto : RegistrarIngresoDto) {
    try {
      // console.log("cuil " + dto.cuil);
      // console.log("temperatura " + dto.temperatura);
      // console.log("frecCardiaca " + dto.frecCardiaca);
      // console.log("frecRespiratoria " + dto.frecRespiratoria);
      // console.log("tensionArterial " + dto.tensionArterial);
      // console.log("nivelEmergencia " + dto.nivelEmergencia);
      // console.log("informe " + dto.informe);
      
      const domicilio: Domicilio = {
        calle: "Las Heras",
        numero: 955,
        localidad: "San Miguel de Tucumán"
      }
      const pacienteBD = new Paciente("20-12345678-1", "Perez", "Juan", domicilio, null);
      this.pacienteService.registrar(pacienteBD);

      const paciente = this.pacienteService.buscar(dto.cuil);

      // console.log("cuil " + paciente?.getCuil())

      if (!paciente) {
        console.log("No se encontró el paciente");
        Redirect(`pacientes/registrar?cuil=${dto.cuil}`);
      }

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

      const ingreso = new Ingreso(paciente!, enfermeraMock, fechaIngreso, dto.informe, nivelEmergencia!, signosVitales);

      await this.ingresoService.registrar(ingreso);

      console.log("El ingreso fue registrado correctamente");

      // Renderizar mensaje de confirmación o redirigir
      return res.render('registrar-ingreso', {
        layout: 'layouts/main',
        title: 'Registrar ingreso',
        niveles: this.nivelesEmergencia,
        mensajeExito: 'El ingreso fue registrado correctamente',
      });
    } catch (error) {
      return res.render('registrar-ingreso', {
        layout: 'layouts/main',
        title: 'Registrar ingreso',
        niveles: this.nivelesEmergencia,
        mensajeError: 'Ocurrió un error al registrar el ingreso',
      });
    }
  }
}
