import { Controller, Post, Body, Inject, UseGuards, Res, Logger } from '@nestjs/common';
import { PACIENTE_SERVICIO, IPacienteService } from '../../application/ports/paciente-service.interface';
import { PacienteDto } from '../../domain/value-objects/paciente.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/domain/value-objects/user-role.enum';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/role.guard';


@Controller('pacientes')
export class PacientesController {

  private readonly logger = new Logger(PacientesController.name);

  constructor(
    @Inject(PACIENTE_SERVICIO)
    private readonly pacienteService: IPacienteService,
  ) { }


  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ENFERMERA)
  async registrarPaciente(@Body() newPaciente: PacienteDto, @Res() res) {

    this.logger.log("Solicitud de registro de nuevo paciente...");

    try {
      await this.pacienteService.registrar(newPaciente);
      res.status(201).send({ message: 'Paciente registrado con éxito' });
      this.logger.log("Paciente registrado con éxito");
      
    } catch (error) {
      this.logger.error("Error al registrar Paciente:", error.message);
      res.status(400).send({ message: error.message });
    }
  }
}
