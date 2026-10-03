import { expect, test } from "vitest";
import { Proceso } from "../src/Proceso.js";
import { SimuladorProcesos } from "../src/SimuladorProcesos.js";

test("calcula el porcentaje de ocupación de memoria", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 250, 5);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso);

  expect(simulador.obtenerOcupacionMemoria()).toBe(25);
});

test("obtiene el mayor bloque libre", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 300, 5);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso);

  expect(simulador.obtenerMayorBloqueLibre()).toBe(700);
});

test("calcula la fragmentación externa", () => {
  const simulador = new SimuladorProcesos();

  simulador.configurar(1000, 3);

  const proceso1 = new Proceso(1, 300, 1);
  const proceso2 = new Proceso(2, 300, 5);
  const proceso3 = new Proceso(3, 300, 5);

  simulador.registrarProceso(proceso1);
  simulador.registrarProceso(proceso2);
  simulador.registrarProceso(proceso3);

  simulador.tick();

  expect(simulador.obtenerFragmentacionExterna()).toBe(25);
});