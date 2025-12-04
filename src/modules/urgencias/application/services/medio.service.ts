import { Injectable } from "@nestjs/common";
import { IMedicoService } from "../ports/medico-service.interface";

@Injectable()
export class MedicoService implements IMedicoService {
}