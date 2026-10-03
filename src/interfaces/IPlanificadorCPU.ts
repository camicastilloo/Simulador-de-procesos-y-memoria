import type { IProceso } from "./IProceso.js";

export interface IPlanificadorCPU {
  agregarProceso(proceso: IProceso): void;
  obtenerProcesoActual(): IProceso | null;
  obtenerColaListos(): IProceso[];
  despachar(): void;
  ejecutarUnidad(): void;
  configurarQuantum(quantum: number): void;
  finalizoProceso(): boolean;
  finalizarProceso(): void;
  bloquearProceso(duracion: number): void;
  quantumVencido(): boolean;
  reencolarPorQuantum(): void;
  renovarQuantum(): void;
  obtenerCambiosContexto(): number;
}