import { IAfiliadoRepository } from "src/modules/pacientes/application/ports/afiliado-repository.interface";
import { Afiliado } from "src/modules/pacientes/domain/value-objects/afiliado.vo";

export class AfiliadoRepositoryMock implements IAfiliadoRepository {
  
  private afiliadosRegistrados: Afiliado[] = [];

  modificar(afiliado: Afiliado): boolean {
    throw new Error("No implementado");
  }
  
  obtener(numeroAfiliado: string): Afiliado | null {
    let afiliado = this.afiliadosRegistrados.find(a => a.numeroAfiliado === numeroAfiliado);
    
    return afiliado ? afiliado : null;
  }
  
  obtenerTodos(): Afiliado[] {
    throw new Error("No implementado");
  }
  
  registrar(afiliado: Afiliado): void {
    this.afiliadosRegistrados.push(afiliado);
  }
}