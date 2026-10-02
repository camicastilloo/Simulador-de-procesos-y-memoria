import { describe, expect, test } from "vitest";
import { SimuladorProcesos } from "../src/SimuladorProcesos.js";
import { Proceso } from "../src/Proceso.js";
import { EstadoProceso } from "../src/EstadoProceso.js";

describe("SimuladorProcesos", () => {
  test("inicia el tick en cero al configurar", () => {
    const simulador = new SimuladorProcesos();

    simulador.configurar(1000, 3);

    expect(simulador.obtenerTick()).toBe(0);
  });

  test("rechaza una memoria no positiva", () => {
    const simulador = new SimuladorProcesos();

    expect(() => simulador.configurar(0, 3)).toThrow();
  });

  test("rechaza un quantum no positivo", () => {
    const simulador = new SimuladorProcesos();

    expect(() => simulador.configurar(1000, 0)).toThrow();
  });
  test("inicializa la memoria completa como libre", () => {
  const simulador = new SimuladorProcesos();

  simulador.configurar(1000, 3);

  expect(simulador.obtenerMemoria()).toBe(1000);
});

test("inicializa el CPU libre", () => {
  const simulador = new SimuladorProcesos();

  simulador.configurar(1000, 3);

  expect(simulador.obtenerProcesoCPU()).toBe(null);
});

test("registra un proceso y lo deja listo si hay memoria", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 200, 5);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso);

  expect(proceso.obtenerEstado()).toBe(EstadoProceso.LISTO);
});

test("deja esperando un proceso si no hay memoria suficiente", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 1200, 5);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso);

  expect(proceso.obtenerEstado()).toBe(EstadoProceso.ESPERANDO_MEMORIA);
});

test("rechaza un PID repetido", () => {
  const simulador = new SimuladorProcesos();
  const proceso1 = new Proceso(1, 200, 5);
  const proceso2 = new Proceso(1, 100, 3);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso1);

  expect(() => simulador.registrarProceso(proceso2)).toThrow();
});

test("incrementa el tick al ejecutar un tick", () => {
  const simulador = new SimuladorProcesos();

  simulador.configurar(1000, 3);
  simulador.tick();

  expect(simulador.obtenerTick()).toBe(1);
});
});