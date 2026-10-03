import type { IProceso } from "./IProceso.js";
import type { IProcesoVista } from "./IProcesoVista.js";
import type { IBloqueMemoriaVista } from "./IBloqueMemoriaVista.js";

export interface ISimuladorProcesos {
  configurar(tamanioMemoria: number, quantum: number): void;
  registrarProceso(proceso: IProceso): void;
  obtenerTick(): number;
  obtenerMemoria(): number;
  obtenerProcesoCPU(): IProcesoVista | null;
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
  obtenerBloquesMemoria(): readonly IBloqueMemoriaVista[];
}