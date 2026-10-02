import type { IPlanificadorCPU } from "./interfaces/IPlanificadorCPU.js";
import type { IProceso } from "./interfaces/IProceso.js";
import { EstadoProceso } from "./EstadoProceso.js";

export class PlanificadorCPU implements IPlanificadorCPU {
  private readonly colaListos: IProceso[];
  private procesoActual: IProceso | null;
  private quantum: number;

  constructor() {
    this.colaListos = [];
    this.procesoActual = null;
    this.quantum = 0;
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

configurarQuantum(quantum: number): void {
  this.quantum = quantum;
}

finalizoProceso(): boolean {
  if (this.procesoActual === null) {
    return false;
  }

  return this.procesoActual.obtenerCPURestante() === 0;
}

finalizarProceso(): void {
  if (this.procesoActual === null) {
    return;
  }

  this.procesoActual.cambiarEstado(EstadoProceso.TERMINADO);
  this.procesoActual = null;
}

quantumVencido(): boolean {
  if (this.procesoActual === null) {
    return false;
  }

  return (
    this.procesoActual.obtenerQuantumConsumido() >=
    this.quantum
  );
}

reencolarPorQuantum(): void {
  if (this.procesoActual === null) {
    return;
  }

  this.procesoActual.cambiarEstado(EstadoProceso.LISTO);
  this.procesoActual.reiniciarQuantum();

  this.colaListos.push(this.procesoActual);
  this.procesoActual = null;
}

renovarQuantum(): void {
  if (this.procesoActual === null) {
    return;
  }

  this.procesoActual.reiniciarQuantum();
}
}