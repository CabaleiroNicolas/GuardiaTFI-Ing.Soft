import { Controller, Post, Body, Inject, Res, UseGuards, Req, Logger, Get, Patch } from '@nestjs/common';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/role.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/domain/value-objects/user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequestVO } from 'src/modules/auth/domain/value-objects/authenticated-user.vo';
import { RegistrarIngresoDto } from '../domain/value-objects/registrar-ingreso.dto';
import { IIngresoService, INGRESO_SERVICIO } from '../application/ports/ingreso-service.interface';
import { Ingreso } from '../domain/entities/ingreso.entity';
import { RegistrarAtencionDto } from '../domain/value-objects/registrar-atencion.dto';
import { ATENCION_SERVICIO, IAtencionService } from '../application/ports/atencion-service.interface';

@Controller('urgencias')
export class UrgenciasController {

  private readonly logger = new Logger(UrgenciasController.name);

  constructor(
    @Inject(INGRESO_SERVICIO)
    private readonly ingresoService: IIngresoService,
    @Inject(ATENCION_SERVICIO)
    private readonly atencionService: IAtencionService,
  ) { }


  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ENFERMERA)
  async registrarIngreso(@Res() res, @Body() dto: RegistrarIngresoDto, @Req() req?: AuthenticatedRequestVO) {

    try {
      this.logger.log("Nueva solicitud de registro de ingreso recibida");
      await this.ingresoService.registrar(dto, req!.user.userId);
      res.status(201).send({ message: 'Ingreso registrado con éxito' });

    } catch (error) {
      this.logger.error("Error al registrar ingreso:", error.message);

      if (error.message.includes('Paciente') || error.message.includes('Enfermera')) {
        res.status(400).send({ message: error.message });
      }
    }
  }


  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ENFERMERA, UserRole.MEDICO)
  async obtenerIngresos(@Res() res) {

    try {
      this.logger.log("Nueva solicitud de obetener ingresos recibida");
      const ingresos: Ingreso[] = await this.ingresoService.obtenerIngresosEnEspera();
      res.status(200).send(ingresos);

    } catch (error) {
      this.logger.error("Error al obtener ingresos:", error.message);
      if (error.message.includes('Paciente')) {
        res.status(400).send({ message: `Error con entidad: ${error.message}` });
      }
    }
  }


  @Get('reclamar')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.MEDICO)
  async reclamarPaciente(@Res() res) {

    try {
      this.logger.log("Nueva solicitud para reclamar Paiente");
      const ingreso: Ingreso = await this.ingresoService.reclamarPaciente();
      res.status(200).send(ingreso);

    } catch (error) {
      this.logger.error("Error al obtener ingresos:", error.message);
      if (error.message.includes('Paciente')) {
        res.status(400).send({ message: `Error con entidad: ${error.message}` });
      }
    }
  }


  @Get('reclamado')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.MEDICO)
  async traerUltimoReclamado(@Res() res) {

    try {
      this.logger.log("Nueva solicitud para obtener ultimo reclamo");
      const ingreso: Ingreso = await this.ingresoService.traerUltimoReclamado();
      res.status(200).send(ingreso);

    } catch (error) {
      this.logger.error("Error al obtener ingresos:", error.message);
      if (error.message.includes('Paciente')) {
        res.status(400).send({ message: `Error con entidad: ${error.message}` });
      }
    }
  }

  @Post('atencion')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.MEDICO)
  async registrarAtencion(@Res() res, @Body() dto: RegistrarAtencionDto, @Req() req?: AuthenticatedRequestVO) {

    try {
      this.logger.log("Nueva solicitud para registrar atencion");
      await this.atencionService.registrarAtencion(dto, req!.user.userId);
      res.status(201).send({ message: 'Atención registrada con éxito' });

    } catch (error) {
      this.logger.error("Error al registrar atención:", error.message);
      res.status(400).send({ message: `Error con entidad: ${error.message}` });

    }
  }


  @Get('atencion')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.MEDICO)
  async obtenerAtenciones(@Res() res) {

    try {
      this.logger.log("Nueva solicitud para obtener atenciones");
      const atenciones = await this.atencionService.obtenerAtenciones();
      console.log(atenciones[0].fecha_atencion)
      res.status(200).send(atenciones);

    } catch (error) {
      this.logger.error("Error al obtener atenciones:", error.message);
      res.status(400).send({ message: `Error con entidad: ${error.message}` });

    }
  }
}
