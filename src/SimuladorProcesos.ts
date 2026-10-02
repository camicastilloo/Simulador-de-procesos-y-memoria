import type { ISimuladorProcesos } from "./interfaces/ISimuladorProcesos.js";

export class SimuladorProcesos implements ISimuladorProcesos {
  private tickActual: number;

  constructor() {
    this.tickActual = 0;
  }

  configurar(tamanioMemoria: number, quantum: number): void {
    if (tamanioMemoria <= 0 || quantum <= 0) {
      throw new Error("La memoria y el quantum deben ser positivos");
    }

    this.tickActual = 0;
  }

  obtenerTick(): number {
    return this.tickActual;
  }
}