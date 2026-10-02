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
test("reencola el proceso cuando vence el quantum y hay otro listo", () => {
  const planificador = new PlanificadorCPU();
  const proceso1 = new Proceso(1, 100, 5);
  const proceso2 = new Proceso(2, 100, 3);

  planificador.configurarQuantum(2);
  planificador.agregarProceso(proceso1);
  planificador.agregarProceso(proceso2);
  planificador.despachar();

  planificador.ejecutarUnidad();
  planificador.ejecutarUnidad();

  planificador.reencolarPorQuantum();

  expect(planificador.obtenerProcesoActual()).toBe(null);
  expect(planificador.obtenerColaListos()).toEqual([
    proceso2,
    proceso1
  ]);
  expect(proceso1.obtenerEstado()).toBe(EstadoProceso.LISTO);
});

test("renueva el quantum cuando no hay otro proceso listo", () => {
  const planificador = new PlanificadorCPU();
  const proceso = new Proceso(1, 100, 5);

  planificador.configurarQuantum(2);
  planificador.agregarProceso(proceso);
  planificador.despachar();

  planificador.ejecutarUnidad();
  planificador.ejecutarUnidad();

  planificador.renovarQuantum();

  expect(planificador.obtenerProcesoActual()).toBe(proceso);
  expect(proceso.obtenerEstado()).toBe(EstadoProceso.EJECUTANDO);
  expect(proceso.obtenerQuantumConsumido()).toBe(0);
});

test("finaliza el proceso y libera el CPU", () => {
  const planificador = new PlanificadorCPU();
  const proceso = new Proceso(1, 100, 1);

  planificador.agregarProceso(proceso);
  planificador.despachar();
  planificador.ejecutarUnidad();

  expect(planificador.finalizoProceso()).toBe(true);

  planificador.finalizarProceso();

  expect(proceso.obtenerEstado()).toBe(EstadoProceso.TERMINADO);
  expect(planificador.obtenerProcesoActual()).toBe(null);
});
test("detecta cuando un proceso debe bloquearse", () => {
  const planificador = new PlanificadorCPU();
  const proceso = new Proceso(1, 100, 5);

  proceso.configurarBloqueoCPU(2, 3);

  planificador.agregarProceso(proceso);
  planificador.despachar();

  planificador.ejecutarUnidad();
  expect(proceso.debeBloquearse()).toBe(false);

  planificador.ejecutarUnidad();
  expect(proceso.debeBloquearse()).toBe(true);
});
});