import { Injectable } from "@nestjs/common";
import { IMedicoRepository } from "../../application/ports/medico-repository.interface";

@Injectable()
export class MedicoRepositoryPg implements IMedicoRepository {
    
}