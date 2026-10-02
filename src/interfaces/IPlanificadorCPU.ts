import type { IProceso } from "./IProceso.js";

export interface IPlanificadorCPU {
  agregarProceso(proceso: IProceso): void;
  obtenerProcesoActual(): IProceso | null;
  obtenerColaListos(): IProceso[];
  despachar(): void;
  ejecutarUnidad(): void;
  configurarQuantum(quantum: number): void;
  finalizoProceso(): boolean;
  quantumVencido(): boolean;
  reencolarPorQuantum(): void;
  renovarQuantum(): void;
}