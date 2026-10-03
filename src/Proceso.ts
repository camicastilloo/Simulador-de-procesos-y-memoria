import type { IProceso } from "./interfaces/IProceso.js";
import { EstadoProceso } from "./EstadoProceso.js";

export class Proceso implements IProceso {
  private readonly pid: number;
  private readonly memoriaRequerida: number;
  private readonly tiempoTotalCPU: number;

  private cpuRestante: number; 
  private cpuConsumida: number;
  private estado: EstadoProceso;
  private quantumConsumido: number;
  private bloqueoRestante: number;
  private ticksParaBloqueo: number;
  private duracionBloqueo: number;

  constructor(
    pid: number,
    memoriaRequerida: number,
    tiempoTotalCPU: number
  ) {
    this.pid = pid;
    this.memoriaRequerida = memoriaRequerida;
    this.tiempoTotalCPU = tiempoTotalCPU;
    this.cpuRestante = tiempoTotalCPU;
    this.cpuConsumida = 0;
    this.estado = EstadoProceso.NUEVO;
    this.quantumConsumido = 0;
    this.bloqueoRestante = 0;
    this.ticksParaBloqueo = 0;
    this.duracionBloqueo = 0;
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

  obtenerCPURestante(): number {
    return this.cpuRestante;
  }

  obtenerEstado(): EstadoProceso {
    return this.estado;
  }

  obtenerQuantumConsumido(): number {
    return this.quantumConsumido;
  }

  obtenerBloqueoRestante(): number {
    return this.bloqueoRestante;
  }
    cambiarEstado(estado: EstadoProceso): void {
    this.estado = estado;
  }

  consumirCPU(): void {
    this.cpuRestante--;
    this.cpuConsumida++;
  }

  reiniciarQuantum(): void {
    this.quantumConsumido = 0;
  }

  consumirQuantum(): void {
    this.quantumConsumido++;
  }

  iniciarBloqueo(duracion: number): void {
    this.bloqueoRestante = duracion;
    this.ticksParaBloqueo = 0;
    this.estado = EstadoProceso.BLOQUEADO;
  }

  disminuirBloqueo(): void {
    if (this.bloqueoRestante > 0) {
      this.bloqueoRestante--;
    }
  }
  configurarBloqueoCPU(ticksCPU: number, duracion: number): void {
  this.ticksParaBloqueo = ticksCPU;
  this.duracionBloqueo = duracion;
}

debeBloquearse(): boolean {
  return (
    this.ticksParaBloqueo > 0 &&
    this.cpuConsumida >= this.ticksParaBloqueo
  );
}

obtenerDuracionBloqueo(): number {
  return this.duracionBloqueo;
}
}
