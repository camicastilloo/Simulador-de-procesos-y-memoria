import { EstadoProceso } from "../EstadoProceso.js";

export interface IProceso {
  obtenerPid(): number;
  obtenerMemoriaRequerida(): number;
  obtenerTiempoTotalCPU(): number;
  obtenerCPURestante(): number;
  obtenerEstado(): EstadoProceso;
  obtenerQuantumConsumido(): number;
  obtenerBloqueoRestante(): number;

  cambiarEstado(estado: EstadoProceso): void;
  consumirCPU(): void;
  reiniciarQuantum(): void;
  consumirQuantum(): void;
  iniciarBloqueo(duracion: number): void;
  disminuirBloqueo(): void;
}