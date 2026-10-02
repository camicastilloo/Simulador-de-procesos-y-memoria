import type { IProceso } from "./IProceso.js";

export interface IPlanificadorCPU {
  agregarProceso(proceso: IProceso): void;
  obtenerProcesoActual(): IProceso | null;
  obtenerColaListos(): IProceso[];
}