import type { IGestorMemoria } from "./interfaces/IGestorMemoria.js";
import type { IBloqueMemoria } from "./interfaces/IBloqueMemoria.js";
import type { IProceso } from "./interfaces/IProceso.js";
import type { IEstrategiaAsignacion } from "./interfaces/IEstrategiaAsignacion.js";
import { BloqueMemoria } from "./BloqueMemoria.js";

export class GestorMemoria implements IGestorMemoria {
  private readonly bloques: BloqueMemoria[];
  private readonly estrategia: IEstrategiaAsignacion;

  constructor(
    tamanioTotal: number,
    estrategia: IEstrategiaAsignacion
  ) {
    this.bloques = [
      new BloqueMemoria(0, tamanioTotal)
    ];
    this.estrategia = estrategia;
  }

  asignarMemoria(proceso: IProceso): boolean {
    const bloque = this.estrategia.buscarBloque(
      this.bloques,
      proceso.obtenerMemoriaRequerida()
    );

    if (bloque === null) {
      return false;
    }

    return true;
  }

  liberarMemoria(proceso: IProceso): void {
    // Falta liberación de memoria
  }

  obtenerBloques(): IBloqueMemoria[] {
    return [...this.bloques];
  }
}