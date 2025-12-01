import { Controller, Post, Body, Inject, Res, UseGuards, Req } from '@nestjs/common';
import { IPacienteService, PACIENTE_SERVICIO } from 'src/modules/pacientes/application/ports/paciente-service.interface';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/role.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/domain/value-objects/user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequestVO } from 'src/modules/auth/domain/value-objects/authenticated-user.vo';
import { RegistrarIngresoDto } from '../domain/value-objects/registrar-ingreso.dto';
import { IIngresoService, INGRESO_SERVICIO } from '../application/ports/ingreso-service.interface';

@Controller('urgencias')
export class UrgenciasController {

  constructor(
    @Inject(INGRESO_SERVICIO)
    private readonly ingresoService: IIngresoService,
    @Inject(PACIENTE_SERVICIO)
    private readonly pacienteService: IPacienteService) { }


  @Post() 
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ENFERMERA)
  async registrarIngreso(@Res() res, @Body() dto: RegistrarIngresoDto, @Req() req?: AuthenticatedRequestVO) {
    
    console.log("Nueva solicitud de registro de ingreso recibida:");
    await this.ingresoService.registrar(dto, req!.user.userId);

    console.log("El ingreso fue registrado correctamente");
    res.status(201).send({ message: 'Ingreso registrado con éxito' });
  }
}
