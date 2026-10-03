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

test("permite consultar los bloques de memoria", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 300, 5);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso);

  const bloques = simulador.obtenerBloquesMemoria();

  expect(bloques).toHaveLength(2);
  expect(bloques[0]?.inicio).toBe(0);
  expect(bloques[0]?.tamanio).toBe(300);
  expect(bloques[0]?.pid).toBe(1);

  expect(bloques[1]?.inicio).toBe(300);
  expect(bloques[1]?.tamanio).toBe(700);
  expect(bloques[1]?.pid).toBeNull();
});

test("la consulta de memoria devuelve una nueva vista", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 300, 5);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso);

  const primeraConsulta = simulador.obtenerBloquesMemoria();
  const segundaConsulta = simulador.obtenerBloquesMemoria();

  expect(primeraConsulta).not.toBe(segundaConsulta);
  expect(primeraConsulta[0]).not.toBe(segundaConsulta[0]);
});

test("la inspección de memoria devuelve una copia independiente", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 200, 3);

  simulador.configurar(1000, 2);
  simulador.registrarProceso(proceso);

  const bloques = simulador.obtenerBloquesMemoria();
  const bloque = bloques[0];

  if (bloque === undefined) {
    throw new Error("No se encontró el bloque de memoria");
  }

  expect(bloque.pid).toBe(1);

  const bloquesNuevos = simulador.obtenerBloquesMemoria();

  expect(bloquesNuevos[0]?.pid).toBe(1);
  expect(bloquesNuevos[0]).not.toBe(bloque);
});

test("la inspección de procesos devuelve una copia independiente", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 200, 3);

  simulador.configurar(1000, 2);
  simulador.registrarProceso(proceso);

  const procesos = simulador.obtenerProcesosListos();
  const vista = procesos[0];

  if (vista === undefined) {
    throw new Error("No se encontró el proceso");
  }

  expect(vista.pid).toBe(1);

  const procesosNuevos = simulador.obtenerProcesosListos();

  expect(procesosNuevos[0]?.pid).toBe(1);
  expect(procesosNuevos[0]).not.toBe(vista);
});