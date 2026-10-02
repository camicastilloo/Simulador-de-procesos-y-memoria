import type { IBloqueMemoria } from "./IBloqueMemoria.js";

export interface IEstrategiaAsignacion {
  buscarBloque(
    bloques: IBloqueMemoria[],
    tamRequerido: number
  ): IBloqueMemoria | null;
}