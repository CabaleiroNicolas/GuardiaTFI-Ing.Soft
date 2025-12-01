import { Controller, Post, Body, Inject, Res, UseGuards, Req, Logger, Get } from '@nestjs/common';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/role.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/domain/value-objects/user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequestVO } from 'src/modules/auth/domain/value-objects/authenticated-user.vo';
import { RegistrarIngresoDto } from '../domain/value-objects/registrar-ingreso.dto';
import { IIngresoService, INGRESO_SERVICIO } from '../application/ports/ingreso-service.interface';

@Controller('urgencias')
export class UrgenciasController {

  private readonly logger = new Logger(UrgenciasController.name);

  constructor(
    @Inject(INGRESO_SERVICIO)
    private readonly ingresoService: IIngresoService,
  ) { }


  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ENFERMERA)
  async registrarIngreso(@Res() res, @Body() dto: RegistrarIngresoDto, @Req() req?: AuthenticatedRequestVO) {

    try {
      this.logger.log("Nueva solicitud de registro de ingreso recibida:");
      await this.ingresoService.registrar(dto, req!.user.userId);
      res.status(201).send({ message: 'Ingreso registrado con éxito' });

    } catch (error) {
      this.logger.error("Error al registrar ingreso:", error.message);

      if (error.message.includes('Paciente') || error.message.includes('Enfermera')) {
        res.status(400).send({ message: `Error con entidad: ${error.message}` });
      }
    }
  }


  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ENFERMERA, UserRole.MEDICO)
  async obtenerIngresos(@Res() res) {

    try {
      this.logger.log("Nueva solicitud de obetener ingresos recibida:");
      const ingresos = await this.ingresoService.obtenerIngresosEnEspera();
      res.status(200).send(ingresos);

    } catch (error) {
      this.logger.error("Error al obtener ingresos:", error.message);
      if (error.message.includes('Paciente')) {
        res.status(400).send({ message: `Error con entidad: ${error.message}` });
      }
    }
  }
}
