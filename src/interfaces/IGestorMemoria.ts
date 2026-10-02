import type { IBloqueMemoria } from "./IBloqueMemoria.js";
import type { IProceso } from "./IProceso.js";

export interface IGestorMemoria {
  asignarMemoria(proceso: IProceso): boolean;
  liberarMemoria(proceso: IProceso): void;
  obtenerBloques(): IBloqueMemoria[];
}