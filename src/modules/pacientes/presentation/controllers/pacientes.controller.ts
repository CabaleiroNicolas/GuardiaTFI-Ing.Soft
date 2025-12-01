import { Controller, Post, Body, Inject, UseGuards, Res } from '@nestjs/common';
import { PACIENTE_SERVICIO, IPacienteService } from '../../application/ports/paciente-service.interface';
import { PacienteDto } from '../../domain/value-objects/paciente.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/domain/value-objects/user-role.enum';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/role.guard';


@Controller('pacientes')
export class PacientesController {

  constructor(
    @Inject(PACIENTE_SERVICIO)
    private readonly pacienteService: IPacienteService,
  ) {}


  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ENFERMERA)
  async registrarPaciente(@Body() newPaciente : PacienteDto, @Res() res) {
    await this.pacienteService.registrar(newPaciente);
    res.status(201).send({ message: 'Paciente registrado con éxito' });
  }
}
