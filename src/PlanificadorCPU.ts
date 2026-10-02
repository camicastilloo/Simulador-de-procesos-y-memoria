import type { IPlanificadorCPU } from "./interfaces/IPlanificadorCPU.js";
import type { IProceso } from "./interfaces/IProceso.js";
import { EstadoProceso } from "./EstadoProceso.js";

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
  despachar(): void {
  if (this.procesoActual !== null) {
    return;
  }

  const siguiente = this.colaListos.shift();

  if (siguiente === undefined) {
    return;
  }

  siguiente.cambiarEstado(EstadoProceso.EJECUTANDO);
  siguiente.reiniciarQuantum();
  this.procesoActual = siguiente;
}

ejecutarUnidad(): void {
  if (this.procesoActual === null) {
    return;
  }

  this.procesoActual.consumirCPU();
  this.procesoActual.consumirQuantum();
}
}