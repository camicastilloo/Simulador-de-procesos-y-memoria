import type { IProceso } from "./IProceso.js";

export interface IBloqueMemoria {
  obtenerInicio(): number;
  obtenerTamanio(): number;
  obtenerProceso(): IProceso | null;
  estaLibre(): boolean;
  asignarProceso(proceso: IProceso): void;
  liberar(): void;
}