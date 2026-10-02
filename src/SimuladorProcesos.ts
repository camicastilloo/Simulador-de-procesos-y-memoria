import type { ISimuladorProcesos } from "./interfaces/ISimuladorProcesos.js";
import { GestorMemoria } from "./GestorMemoria.js";
import { FirstFit } from "./FirstFit.js";
import { PlanificadorCPU } from "./PlanificadorCPU.js";

export class SimuladorProcesos implements ISimuladorProcesos {
  private tickActual: number;
  private gestorMemoria: GestorMemoria | null;
  private planificadorCPU: PlanificadorCPU | null;

  constructor() {
    this.tickActual = 0;
    this.gestorMemoria = null;
    this.planificadorCPU = null;
  }

  configurar(tamanioMemoria: number, quantum: number): void {
    if (tamanioMemoria <= 0 || quantum <= 0) {
      throw new Error("La memoria y el quantum deben ser positivos");
    }

    this.tickActual = 0;
    this.gestorMemoria = new GestorMemoria(
      tamanioMemoria,
      new FirstFit()
    );

    this.planificadorCPU = new PlanificadorCPU();
    this.planificadorCPU.configurarQuantum(quantum);
  }

  obtenerTick(): number {
    return this.tickActual;
  }

  obtenerMemoria(): number {
    if (this.gestorMemoria === null) {
      return 0;
    }

    return this.gestorMemoria
      .obtenerBloques()
      .reduce(
        (total, bloque) => total + bloque.obtenerTamanio(),
        0
      );
  }

  obtenerProcesoCPU(): unknown | null {
    if (this.planificadorCPU === null) {
      return null;
    }

    return this.planificadorCPU.obtenerProcesoActual();
  }
}