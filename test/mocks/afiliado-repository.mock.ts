import { IAfiliadoRepository } from "src/modules/pacientes/application/ports/afiliado-repository.interface";
import { Afiliado } from "src/modules/pacientes/domain/value-objects/afiliado.vo";

export class AfiliadoRepositoryMock implements IAfiliadoRepository {
  
  private afiliadosRegistrados: Afiliado[] = [];

  async modificar(afiliado: Afiliado): Promise<void> {
    throw new Error("No implementado");
  }
  
  async obtener(numeroAfiliado: string): Promise<Afiliado | null> {
    let afiliado = this.afiliadosRegistrados.find(a => a.numeroAfiliado === numeroAfiliado);
    
    return afiliado ? afiliado : null;
  }
  
  async obtenerTodos(): Promise<Afiliado[]> {
    throw new Error("No implementado");
  }
  
  async registrar(afiliado: Afiliado): Promise<void> {
    this.afiliadosRegistrados.push(afiliado);
  }
}