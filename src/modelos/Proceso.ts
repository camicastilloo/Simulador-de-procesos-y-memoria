import type { IProceso } from "../interfaces/IProceso.js";

export class Proceso implements IProceso {
  private readonly pid: number;
  private readonly memoriaRequerida: number;
  private readonly tiempoTotalCPU: number;

  constructor(
    pid: number,
    memoriaRequerida: number,
    tiempoTotalCPU: number
  ) {
    this.pid = pid;
    this.memoriaRequerida = memoriaRequerida;
    this.tiempoTotalCPU = tiempoTotalCPU;
  }

  obtenerPid(): number {
    return this.pid;
  }

  obtenerMemoriaRequerida(): number {
    return this.memoriaRequerida;
  }

  obtenerTiempoTotalCPU(): number {
    return this.tiempoTotalCPU;
  }
}