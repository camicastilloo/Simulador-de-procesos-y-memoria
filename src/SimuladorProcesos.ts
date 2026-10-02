import type { ISimuladorProcesos } from "./interfaces/ISimuladorProcesos.js";
import type { IProceso } from "./interfaces/IProceso.js";
import { GestorMemoria } from "./GestorMemoria.js";
import { FirstFit } from "./FirstFit.js";
import { PlanificadorCPU } from "./PlanificadorCPU.js";
import { EstadoProceso } from "./EstadoProceso.js";

export class SimuladorProcesos implements ISimuladorProcesos {
  private tickActual: number;
  private gestorMemoria: GestorMemoria | null;
  private planificadorCPU: PlanificadorCPU | null;
  private readonly procesos: IProceso[];

  constructor() {
    this.tickActual = 0;
    this.gestorMemoria = null;
    this.planificadorCPU = null;
    this.procesos = [];
  }

  configurar(tamanioMemoria: number, quantum: number): void {
    if (tamanioMemoria <= 0 || quantum <= 0) {
      throw new Error("La memoria y el quantum deben ser positivos");
    }

    this.tickActual = 0;
    this.gestorMemoria = new GestorMemoria(
      tamanioMemoria,
      new FirstFit()
    );

    this.planificadorCPU = new PlanificadorCPU();
    this.planificadorCPU.configurarQuantum(quantum);
  }

  registrarProceso(proceso: IProceso): void {
  if (proceso.obtenerMemoriaRequerida() <= 0) {
    throw new Error("La memoria requerida debe ser positiva");
  }

  if (proceso.obtenerTiempoTotalCPU() <= 0) {
    throw new Error("El tiempo de CPU debe ser positivo");
  }

  if (
    this.procesos.some(
      actual => actual.obtenerPid() === proceso.obtenerPid()
    )
  ) {
    throw new Error("El PID ya existe");
  }

  if (this.gestorMemoria === null) {
    throw new Error("El simulador no está configurado");
  }

  const asignado = this.gestorMemoria.asignarMemoria(proceso);

  if (asignado) {
    proceso.cambiarEstado(EstadoProceso.LISTO);

    if (this.planificadorCPU === null) {
      throw new Error("El simulador no está configurado");
    }

    this.planificadorCPU.agregarProceso(proceso);
  } else {
    proceso.cambiarEstado(EstadoProceso.ESPERANDO_MEMORIA);
  }

  this.procesos.push(proceso);
}

tick(): void {
  if (this.gestorMemoria === null || this.planificadorCPU === null) {
    throw new Error("El simulador no está configurado");
  }

  // Fase 1: admitir procesos esperando memoria
  for (const proceso of this.procesos) {
    if (proceso.obtenerEstado() !== EstadoProceso.ESPERANDO_MEMORIA) {
      continue;
    }

    const asignado = this.gestorMemoria.asignarMemoria(proceso);

    if (asignado) {
      proceso.cambiarEstado(EstadoProceso.LISTO);
      this.planificadorCPU.agregarProceso(proceso);
    }
  }

  // Fase 2: despachar y ejecutar una unidad de CPU
  this.planificadorCPU.despachar();
  this.planificadorCPU.ejecutarUnidad();

   // Fase 3: finalizar si terminó su CPU
  const procesoActual = this.planificadorCPU.obtenerProcesoActual();

  if (this.planificadorCPU.finalizoProceso() && procesoActual !== null) {
    this.planificadorCPU.finalizarProceso();
    this.gestorMemoria.liberarMemoria(procesoActual);
  }
  else if (this.planificadorCPU.quantumVencido()) {
  if (this.planificadorCPU.obtenerColaListos().length > 0) {
    this.planificadorCPU.reencolarPorQuantum();
  } else {
    this.planificadorCPU.renovarQuantum();
  }
}

  this.tickActual++;
}

  obtenerTick(): number {
    return this.tickActual;
  }

  obtenerMemoria(): number {
  if (this.gestorMemoria === null) {
    return 0;
  }

  return this.gestorMemoria
    .obtenerBloques()
    .filter(bloque => bloque.estaLibre())
    .reduce(
      (total, bloque) => total + bloque.obtenerTamanio(),
      0
    );
}

  obtenerProcesoCPU(): unknown | null {
    if (this.planificadorCPU === null) {
      return null;
    }

    return this.planificadorCPU.obtenerProcesoActual();
  }
}