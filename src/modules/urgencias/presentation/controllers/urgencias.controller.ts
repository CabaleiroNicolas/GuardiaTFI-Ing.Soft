import { Controller, Post, Body, Inject, Res, UseGuards, Req } from '@nestjs/common';
import { IIngresoService, INGRESO_SERVICIO } from '../../application/ports/ingreso-service.interface';
import { IPacienteService, PACIENTE_SERVICIO } from 'src/modules/pacientes/application/ports/paciente-service.interface';
import { Enfermera } from '../../domain/entities/enfermera.entity';
import { RegistrarIngresoDto } from '../../domain/value-objects/registrar-ingreso.dto';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/role.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/domain/value-objects/user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequestVO } from 'src/modules/auth/domain/value-objects/authenticated-user.vo';

@Controller('urgencias')
export class UrgenciasController {

  constructor(
    @Inject(INGRESO_SERVICIO)
    private readonly ingresoService: IIngresoService,
    @Inject(PACIENTE_SERVICIO)
    private readonly pacienteService: IPacienteService) { }


  @Post()/* 
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ENFERMERA) */
  async registrarIngreso(@Res() res, @Body() dto: RegistrarIngresoDto){ //@Req() req?: AuthenticatedRequestVO) {

    await this.ingresoService.registrar(dto, 1);

    console.log("El ingreso fue registrado correctamente");
    res.status(201).send({ message: 'Ingreso registrado con éxito' });
  }
}
