import type { ISimuladorProcesos } from "./interfaces/ISimuladorProcesos.js";
import type { IProceso } from "./interfaces/IProceso.js";
import type { IProcesoVista } from "./interfaces/IProcesoVista.js";
import type { IBloqueMemoriaVista } from "./interfaces/IBloqueMemoriaVista.js";
import { GestorMemoria } from "./GestorMemoria.js";
import { FirstFit } from "./FirstFit.js";
import { PlanificadorCPU } from "./PlanificadorCPU.js";
import { EstadoProceso } from "./EstadoProceso.js";

export class SimuladorProcesos implements ISimuladorProcesos {
  private tickActual: number;
  private gestorMemoria: GestorMemoria | null;
  private planificadorCPU: PlanificadorCPU | null;
  private readonly procesos: IProceso[];
  private unidadesCPUUtilizadas: number;
  private tamanioMemoria: number;

  constructor() {
    this.tickActual = 0;
    this.gestorMemoria = null;
    this.planificadorCPU = null;
    this.procesos = [];
    this.unidadesCPUUtilizadas = 0;
    this.tamanioMemoria = 0;
  }

  configurar(tamanioMemoria: number, quantum: number): void {
    if (
  !Number.isInteger(tamanioMemoria) ||
  tamanioMemoria <= 0 ||
  !Number.isInteger(quantum) ||
  quantum <= 0
) {
  throw new Error("La memoria y el quantum deben ser enteros positivos");
}

    this.tamanioMemoria = tamanioMemoria;
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

  if (proceso.obtenerMemoriaRequerida() > this.tamanioMemoria) {
  throw new Error("El proceso requiere más memoria que la disponible");
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

      // Fase 2: actualizar procesos bloqueados
    for (const proceso of this.procesos) {
      if (proceso.obtenerEstado() !== EstadoProceso.BLOQUEADO) {
        continue;
      }

      proceso.disminuirBloqueo();

      if (proceso.obtenerBloqueoRestante() === 0) {
        proceso.cambiarEstado(EstadoProceso.LISTO);
        this.planificadorCPU.agregarProceso(proceso);
      }
    }

  // Fase 3: despachar y ejecutar una unidad de CPU
  this.planificadorCPU.despachar();
  this.planificadorCPU.ejecutarUnidad();
  if (this.planificadorCPU.obtenerProcesoActual() !== null) {
  this.unidadesCPUUtilizadas++; 
}

  // Fase 4: finalizar, bloquear o controlar quantum
const procesoActual = this.planificadorCPU.obtenerProcesoActual();

if (this.planificadorCPU.finalizoProceso() && procesoActual !== null) {
  this.planificadorCPU.finalizarProceso();
  this.gestorMemoria.liberarMemoria(procesoActual);
} else if (
  procesoActual !== null &&
  procesoActual.debeBloquearse()
) {
  this.planificadorCPU.bloquearProceso(
    procesoActual.obtenerDuracionBloqueo()
  );
} else if (this.planificadorCPU.quantumVencido()) {

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

  obtenerOcupacionMemoria(): number {
  if (this.gestorMemoria === null) {
    return 0;
  }

  const memoriaLibre = this.obtenerMemoria();

  // La memoria total se obtiene sumando todos los bloques.
  const memoriaTotal = this.gestorMemoria
    .obtenerBloques()
    .reduce(
      (total, bloque) => total + bloque.obtenerTamanio(),
      0
    );

  if (memoriaTotal === 0) {
    return 0;
  }

  return ((memoriaTotal - memoriaLibre) / memoriaTotal) * 100;
}

obtenerMayorBloqueLibre(): number {
  if (this.gestorMemoria === null) {
    return 0;
  }

  const bloquesLibres = this.gestorMemoria
    .obtenerBloques()
    .filter(bloque => bloque.estaLibre());

  if (bloquesLibres.length === 0) {
    return 0;
  }

  return Math.max(
    ...bloquesLibres.map(bloque => bloque.obtenerTamanio())
  );
}

obtenerFragmentacionExterna(): number {
  const memoriaLibre = this.obtenerMemoria();

  if (memoriaLibre === 0) {
    return 0;
  }

  const mayorBloqueLibre = this.obtenerMayorBloqueLibre();

  return (
    (1 - mayorBloqueLibre / memoriaLibre) * 100
  );
}

obtenerUtilizacionCPU(): number {
  if (this.tickActual === 0) {
    return 0;
  }

  return (this.unidadesCPUUtilizadas / this.tickActual) * 100;
}

obtenerCambiosContexto(): number {
  if (this.planificadorCPU === null) {
    return 0;
  }

  return this.planificadorCPU.obtenerCambiosContexto();
}

obtenerProcesosListos(): readonly IProcesoVista[] {
  if (this.planificadorCPU === null) {
    return [];
  }

  return this.planificadorCPU
    .obtenerColaListos()
    .map(proceso => ({
      pid: proceso.obtenerPid(),
      memoriaRequerida: proceso.obtenerMemoriaRequerida(),
      cpuRestante: proceso.obtenerCPURestante(),
      estado: proceso.obtenerEstado(),
      quantumConsumido: proceso.obtenerQuantumConsumido(),
      bloqueoRestante: proceso.obtenerBloqueoRestante()
    }));
}

obtenerProcesosEsperandoMemoria(): readonly IProcesoVista[] {
  return this.obtenerProcesosPorEstado(
    EstadoProceso.ESPERANDO_MEMORIA
  );
}

obtenerProcesosBloqueados(): readonly IProcesoVista[] {
  return this.obtenerProcesosPorEstado(
    EstadoProceso.BLOQUEADO
  );
}

obtenerProcesosTerminados(): readonly IProcesoVista[] {
  return this.obtenerProcesosPorEstado(
    EstadoProceso.TERMINADO
  );
}

obtenerBloquesMemoria(): readonly IBloqueMemoriaVista[] {
  if (this.gestorMemoria === null) {
    return [];
  }

  return this.gestorMemoria.obtenerBloques().map(bloque => ({
    inicio: bloque.obtenerInicio(),
    tamanio: bloque.obtenerTamanio(),
    pid: bloque.obtenerProceso()?.obtenerPid() ?? null
  }));
}

private obtenerProcesosPorEstado(
  estado: EstadoProceso
): readonly IProcesoVista[] {
  return this.procesos
    .filter(proceso => proceso.obtenerEstado() === estado)
    .map(proceso => ({
      pid: proceso.obtenerPid(),
      memoriaRequerida: proceso.obtenerMemoriaRequerida(),
      cpuRestante: proceso.obtenerCPURestante(),
      estado: proceso.obtenerEstado(),
      quantumConsumido: proceso.obtenerQuantumConsumido(),
      bloqueoRestante: proceso.obtenerBloqueoRestante()
    }));
}
}