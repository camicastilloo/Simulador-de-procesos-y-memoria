import { describe, expect, test } from "vitest";
import { PlanificadorCPU } from "../src/PlanificadorCPU.js";
import { Proceso } from "../src/Proceso.js";
import { EstadoProceso } from "../src/EstadoProceso.js";

describe("PlanificadorCPU", () => {
  test("agrega procesos manteniendo el orden FIFO", () => {
    const planificador = new PlanificadorCPU();
    const proceso1 = new Proceso(1, 100, 5);
    const proceso2 = new Proceso(2, 100, 3);

    planificador.agregarProceso(proceso1);
    planificador.agregarProceso(proceso2);

    expect(planificador.obtenerColaListos()).toEqual([
      proceso1,
      proceso2
    ]);
  });

  test("despacha el primer proceso de la cola", () => {
    const planificador = new PlanificadorCPU();
    const proceso = new Proceso(1, 100, 5);

    planificador.agregarProceso(proceso);
    planificador.despachar();

    expect(planificador.obtenerProcesoActual()).toBe(proceso);
    expect(proceso.obtenerEstado()).toBe(EstadoProceso.EJECUTANDO);
    expect(planificador.obtenerColaListos()).toEqual([]);
  });
  test("ejecuta una unidad de CPU", () => {
  const planificador = new PlanificadorCPU();
  const proceso = new Proceso(1, 100, 5);

  planificador.agregarProceso(proceso);
  planificador.despachar();
  planificador.ejecutarUnidad();

  expect(proceso.obtenerCPURestante()).toBe(4);
  expect(proceso.obtenerQuantumConsumido()).toBe(1);
});

test("detecta cuando el proceso finalizó", () => {
  const planificador = new PlanificadorCPU();
  const proceso = new Proceso(1, 100, 1);

  planificador.agregarProceso(proceso);
  planificador.despachar();
  planificador.ejecutarUnidad();

  expect(planificador.finalizoProceso()).toBe(true);
});

test("detecta cuando vence el quantum", () => {
  const planificador = new PlanificadorCPU();
  const proceso = new Proceso(1, 100, 5);

  planificador.configurarQuantum(2);
  planificador.agregarProceso(proceso);
  planificador.despachar();

  planificador.ejecutarUnidad();
  planificador.ejecutarUnidad();

  expect(planificador.quantumVencido()).toBe(true);
});
});