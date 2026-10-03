import { expect, test } from "vitest";
import { Proceso } from "../src/Proceso.js";
import { SimuladorProcesos } from "../src/SimuladorProcesos.js";
import { EstadoProceso } from "../src/EstadoProceso.js";

test("permite consultar los procesos listos", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 100, 5);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso);

  const procesos = simulador.obtenerProcesosListos();

  expect(procesos).toHaveLength(1);
  expect(procesos[0]?.pid).toBe(1);
  expect(procesos[0]?.estado).toBe(EstadoProceso.LISTO);
});

test("permite consultar procesos bloqueados", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 100, 5);

  simulador.configurar(1000, 3);
  proceso.configurarBloqueoCPU(1, 2);
  simulador.registrarProceso(proceso);

  simulador.tick();

  const procesos = simulador.obtenerProcesosBloqueados();

  expect(procesos).toHaveLength(1);
  expect(procesos[0]?.pid).toBe(1);
});

test("permite consultar procesos terminados", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 100, 1);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso);

  simulador.tick();

  const procesos = simulador.obtenerProcesosTerminados();

  expect(procesos).toHaveLength(1);
  expect(procesos[0]?.pid).toBe(1);
});