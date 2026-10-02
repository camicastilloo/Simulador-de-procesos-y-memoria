import type { IPlanificadorCPU } from "./interfaces/IPlanificadorCPU.js";
import type { IProceso } from "./interfaces/IProceso.js";

export class PlanificadorCPU implements IPlanificadorCPU {
  private readonly colaListos: IProceso[];
  private procesoActual: IProceso | null;

  constructor() {
    this.colaListos = [];
    this.procesoActual = null;
  }

  agregarProceso(proceso: IProceso): void {
    this.colaListos.push(proceso);
  }

  obtenerProcesoActual(): IProceso | null {
    return this.procesoActual;
  }

  obtenerColaListos(): IProceso[] {
    return [...this.colaListos];
  }
}