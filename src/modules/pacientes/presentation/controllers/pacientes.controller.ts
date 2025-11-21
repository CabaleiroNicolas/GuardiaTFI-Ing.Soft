import { Controller, Get, Post, Body, Query, Render, Inject } from '@nestjs/common';
import { PACIENTE_SERVICIO, IPacienteService } from '../../application/ports/paciente-service.interface';
import { IObraSocialRepository, OBRASOCIAL_REPOSITORIO } from '../../application/ports/obra-social-repository.interface';
import { ObraSocial } from '../../domain/entities/obra-social.entity';
import { AFILIADO_REPOSITORIO, IAfiliadoRepository } from '../../application/ports/afiliado-repository.interface';
import { Afiliado } from '../../domain/value-objects/afiliado.vo';
import { PacienteDto } from '../../domain/value-objects/paciente.dto';
import { Paciente } from '../../domain/entities/paciente.entity';
import { Domicilio } from '../../domain/value-objects/domicilio.vo';

@Controller('pacientes')
export class PacientesController {

  constructor(
    @Inject(PACIENTE_SERVICIO)
    private readonly pacienteService: IPacienteService,
    @Inject(OBRASOCIAL_REPOSITORIO)
    private readonly obraSocialRepo: IObraSocialRepository,
    @Inject(AFILIADO_REPOSITORIO)
    private readonly afiliadoRepo: IAfiliadoRepository
  ) {}

  @Get('registrar')
  @Render('registrar-paciente')
  async mostrarFormulario(@Query('cuil') cuil?: string) {
    
    const obraCargada = new ObraSocial("1", "Subsidio");
    this.obraSocialRepo.registrar(obraCargada);

    const afiliadoCargado: Afiliado = {
      numeroAfiliado: "123",
      obraSocial: obraCargada
    }
    this.afiliadoRepo.registrar(afiliadoCargado);

    const obras = await this.obraSocialRepo.obtenerTodos();

    return {
      layout: 'layouts/main',
      title: 'Registrar paciente',
      cuil: cuil ?? '',
      obras
    };
  }

  @Post('registrar')
  @Render('registrar-paciente')
  async registrarPaciente(@Body() dto : PacienteDto) {
    const obras = await this.obraSocialRepo.obtenerTodos();

    console.log("cuil " + dto.cuil);
    console.log("apellido " + dto.apellido);
    console.log("nombre " + dto.nombre);
    console.log("calle " + dto.calle);
    console.log("numero " + dto.numero);
    console.log("localidad " + dto.localidad);
    console.log("obraSocial " + dto.obraSocial);
    console.log("numeroAfiliado " + dto.numeroAfiliado);

    // TODO: Validar existencia del paciente con el cuil indicado

    const obra = obras.find(o => o.getId() === dto.obraSocial);
    const afiliado: Afiliado = {
      numeroAfiliado: dto.numeroAfiliado,
      obraSocial: obra!
    }
    const domicilio: Domicilio = {
      calle: dto.calle,
      numero: dto.numero,
      localidad: dto.localidad
    }

    const paciente = new Paciente(dto.cuil, dto.apellido, dto.nombre, domicilio, afiliado);

    try {
      await this.pacienteService.registrar(paciente);
      console.log("Paciente registrado correctamente");
      console.log(this.pacienteService.obtenerPacientesRegistrados());

      return {
        layout: 'layouts/main',
        title: 'Registrar paciente',
        success: 'Paciente registrado correctamente.',
        obras
      };
    } catch (error) {
      return {
        layout: 'layouts/main',
        title: 'Registrar paciente',
        errores: [error.message],
        obras,
        ...dto
      };
    }
  }
}
