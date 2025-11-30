import { Controller, Post, Body, Inject } from '@nestjs/common';
import { PACIENTE_SERVICIO, IPacienteService } from '../../application/ports/paciente-service.interface';
import { PacienteDto } from '../../domain/value-objects/paciente.dto';


@Controller('pacientes')
export class PacientesController {

  constructor(
    @Inject(PACIENTE_SERVICIO)
    private readonly pacienteService: IPacienteService,
  ) {}


  @Post()
  async registrarPaciente(@Body() newPaciente : PacienteDto) {

    console.log("cuil " + newPaciente.cuil);
    console.log("apellido " + newPaciente.apellido);
    console.log("nombre " + newPaciente.nombre);
    console.log("calle " + newPaciente.calle);
    console.log("numero " + newPaciente.numero);
    console.log("localidad " + newPaciente.localidad);
    console.log("obraSocial " + newPaciente.obraSocial);
    console.log("numeroAfiliado " + newPaciente.numeroAfiliado);

    await this.pacienteService.registrar(newPaciente);
   
  }
}
