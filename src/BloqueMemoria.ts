import type { IBloqueMemoria } from "./interfaces/IBloqueMemoria.js";
import type { IProceso } from "./interfaces/IProceso.js";

export class BloqueMemoria implements IBloqueMemoria {
  private readonly inicio: number;
  private readonly tamanio: number;
  private proceso: IProceso | null;

  constructor(
    inicio: number,
    tamanio: number,
    proceso: IProceso | null = null
  ) {
    this.inicio = inicio;
    this.tamanio = tamanio;
    this.proceso = proceso;
  }

  obtenerInicio(): number {
    return this.inicio;
  }

  obtenerTamanio(): number {
    return this.tamanio;
  }

  obtenerProceso(): IProceso | null {
    return this.proceso;
  }

  estaLibre(): boolean {
    return this.proceso === null;
  }
  asignarProceso(proceso: IProceso): void {
    this.proceso = proceso;
}
}