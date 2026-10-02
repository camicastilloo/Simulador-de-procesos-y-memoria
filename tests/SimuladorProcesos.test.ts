import { describe, expect, test } from "vitest";
import { SimuladorProcesos } from "../src/SimuladorProcesos.js";

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
});