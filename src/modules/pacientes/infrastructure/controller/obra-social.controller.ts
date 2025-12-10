import { Controller, Get, Inject, Logger, Res, UseGuards } from "@nestjs/common";
import { IObraSocialService, OBRASOCIAL_SERVICIO } from "../../application/ports/obra-social-service.interface";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/modules/auth/infrastructure/guards/role.guard";
import { UserRole } from "src/modules/user/domain/value-objects/user-role.enum";
import { Roles } from "src/modules/auth/infrastructure/decorators/roles.decorator";

@Controller('obras_sociales')
export class ObraSocialController {

  private readonly logger = new Logger(ObraSocialController.name);

  constructor(
    @Inject(OBRASOCIAL_SERVICIO)
    private readonly obraSocialService: IObraSocialService,
  ) { }


  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ENFERMERA)
  async registrarPaciente(@Res() res) {

    this.logger.log("Solicitud de registro de nuevo paciente...");

    try {
      const obrasSociales: string[] = await this.obraSocialService.obtenerObrasSociales();
      res.status(200).send(obrasSociales);
      this.logger.log("Obras sociales obtenidas con éxito");
      
    } catch (error) {
      this.logger.error("Error al obtener obras sociales:", error.message);
      res.status(400).send({ message: error.message });
    }
  }
}