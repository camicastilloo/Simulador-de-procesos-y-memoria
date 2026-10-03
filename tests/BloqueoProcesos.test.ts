import { describe, expect, test } from "vitest";
import { Proceso } from "../src/Proceso.js";
import { EstadoProceso } from "../src/EstadoProceso.js";
import { PlanificadorCPU } from "../src/PlanificadorCPU.js";
import { SimuladorProcesos } from "../src/SimuladorProcesos.js";

describe("Bloqueo de procesos", () => {
test("bloquea un proceso durante el tick", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 100, 5);

  simulador.configurar(1000, 3);
  proceso.configurarBloqueoCPU(2, 2);

  simulador.registrarProceso(proceso);

  simulador.tick();
  expect(proceso.obtenerEstado()).toBe(EstadoProceso.EJECUTANDO);

  simulador.tick();

  expect(proceso.obtenerEstado()).toBe(EstadoProceso.BLOQUEADO);
  expect(simulador.obtenerProcesoCPU()).toBeNull();
});

test("desbloquea un proceso cuando termina su bloqueo", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 100, 5);

  simulador.configurar(1000, 3);
  proceso.configurarBloqueoCPU(2, 2);

  simulador.registrarProceso(proceso);

  simulador.tick();
  simulador.tick();

  expect(proceso.obtenerEstado()).toBe(EstadoProceso.BLOQUEADO);
  expect(proceso.obtenerBloqueoRestante()).toBe(2);

  simulador.tick();
  expect(proceso.obtenerEstado()).toBe(EstadoProceso.BLOQUEADO);
  expect(proceso.obtenerBloqueoRestante()).toBe(1);

  simulador.tick();

  expect(proceso.obtenerEstado()).toBe(EstadoProceso.EJECUTANDO);
  expect(proceso.obtenerBloqueoRestante()).toBe(0);
});

test("un proceso bloqueado conserva su memoria", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 200, 5);

  simulador.configurar(1000, 3);
  proceso.configurarBloqueoCPU(1, 2);

  simulador.registrarProceso(proceso);

  expect(simulador.obtenerMemoria()).toBe(800);

  simulador.tick();

  expect(proceso.obtenerEstado()).toBe(EstadoProceso.BLOQUEADO);
  expect(simulador.obtenerMemoria()).toBe(800);
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

test("bloquea por CPU aunque el quantum haya vencido antes", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 200, 5);

  simulador.configurar(1000, 2);
  proceso.configurarBloqueoCPU(3, 2);

  simulador.registrarProceso(proceso);

  simulador.tick();
  simulador.tick();

  expect(proceso.obtenerEstado()).toBe(EstadoProceso.EJECUTANDO);

  simulador.tick();

  expect(proceso.obtenerEstado()).toBe(EstadoProceso.BLOQUEADO);
});

test("rechaza una configuración de bloqueo inválida", () => {
  const proceso = new Proceso(1, 200, 5);

  expect(() => proceso.configurarBloqueoCPU(0, 2)).toThrow();
  expect(() => proceso.configurarBloqueoCPU(2, 0)).toThrow();
  expect(() => proceso.configurarBloqueoCPU(-1, 2)).toThrow();
  expect(() => proceso.configurarBloqueoCPU(2, -1)).toThrow();
  expect(() => proceso.configurarBloqueoCPU(1.5, 2)).toThrow();
  expect(() => proceso.configurarBloqueoCPU(2, 1.5)).toThrow();
});
});