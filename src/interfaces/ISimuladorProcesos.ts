export interface ISimuladorProcesos {
  configurar(tamanioMemoria: number, quantum: number): void;
  obtenerTick(): number;
  obtenerMemoria(): number;
  obtenerProcesoCPU(): unknown | null;
}

import type { IProceso } from "./IProceso.js";

export interface ISimuladorProcesos {
  configurar(tamanioMemoria: number, quantum: number): void;
  registrarProceso(proceso: IProceso): void;
  obtenerTick(): number;
  obtenerMemoria(): number;
  obtenerProcesoCPU(): unknown | null;
  tick(): void;
  obtenerOcupacionMemoria(): number;
  obtenerMayorBloqueLibre(): number;
  obtenerFragmentacionExterna(): number;
}