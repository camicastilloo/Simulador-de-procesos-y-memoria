import type { IProceso } from "./IProceso.js";
import type { IProcesoVista } from "./IProcesoVista.js";

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
  obtenerUtilizacionCPU(): number;
  obtenerCambiosContexto(): number;
  obtenerProcesosListos(): readonly IProcesoVista[];
  obtenerProcesosEsperandoMemoria(): readonly IProcesoVista[];
  obtenerProcesosBloqueados(): readonly IProcesoVista[];
  obtenerProcesosTerminados(): readonly IProcesoVista[];
}