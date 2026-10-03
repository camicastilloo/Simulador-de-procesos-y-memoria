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

  const proceso1 = new Proceso(1, 700, 5);
  const proceso2 = new Proceso(2, 500, 5);

  simulador.configurar(1000, 3);

  simulador.registrarProceso(proceso1);
  simulador.registrarProceso(proceso2);

  expect(proceso2.obtenerEstado()).toBe(EstadoProceso.ESPERANDO_MEMORIA);
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

test("despacha un proceso listo durante el tick", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 200, 5);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso);

  simulador.tick();

  expect(simulador.obtenerProcesoCPU()?.pid).toBe(proceso.obtenerPid());
  expect(proceso.obtenerEstado()).toBe(EstadoProceso.EJECUTANDO);
});

test("ejecuta una unidad de CPU durante el tick", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 200, 5);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso);

  simulador.tick();

  expect(proceso.obtenerCPURestante()).toBe(4);
});

test("finaliza un proceso cuando consume toda su CPU", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 200, 1);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso);

  simulador.tick();

  expect(proceso.obtenerEstado()).toBe(EstadoProceso.TERMINADO);
  expect(simulador.obtenerProcesoCPU()).toBe(null);
});

test("libera la memoria cuando un proceso termina", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 200, 1);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso);

  simulador.tick();

  expect(simulador.obtenerMemoria()).toBe(1000);
});

test("admite un proceso esperando después de liberar memoria", () => {
  const simulador = new SimuladorProcesos();
  const proceso1 = new Proceso(1, 800, 1);
  const proceso2 = new Proceso(2, 300, 5);

  simulador.configurar(1000, 3);
  simulador.registrarProceso(proceso1);
  simulador.registrarProceso(proceso2);

  expect(proceso2.obtenerEstado()).toBe(EstadoProceso.ESPERANDO_MEMORIA);

  simulador.tick();

  expect(proceso1.obtenerEstado()).toBe(EstadoProceso.TERMINADO);
  expect(proceso2.obtenerEstado()).toBe(EstadoProceso.ESPERANDO_MEMORIA);

  simulador.tick();

  expect(proceso2.obtenerEstado()).toBe(EstadoProceso.EJECUTANDO);
});

test("reencola el proceso cuando vence el quantum", () => {
  const simulador = new SimuladorProcesos();
  const proceso1 = new Proceso(1, 200, 5);
  const proceso2 = new Proceso(2, 200, 5);

  simulador.configurar(1000, 2);
  simulador.registrarProceso(proceso1);
  simulador.registrarProceso(proceso2);

  simulador.tick();
  simulador.tick();

  expect(proceso1.obtenerEstado()).toBe(EstadoProceso.LISTO);
  expect(simulador.obtenerProcesoCPU()).toBe(null);

  simulador.tick();

  expect(simulador.obtenerProcesoCPU()?.pid).toBe(proceso2.obtenerPid());
  expect(proceso2.obtenerEstado()).toBe(EstadoProceso.EJECUTANDO);
});

test("renueva el quantum si no hay otro proceso listo", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 200, 5);

  simulador.configurar(1000, 2);
  simulador.registrarProceso(proceso);

  simulador.tick();
  simulador.tick();

  expect(simulador.obtenerProcesoCPU()?.pid).toBe(proceso.obtenerPid());
  expect(proceso.obtenerEstado()).toBe(EstadoProceso.EJECUTANDO);
  expect(proceso.obtenerQuantumConsumido()).toBe(0);
});

test("rechaza memoria no entera", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 500.5, 5);

  simulador.configurar(1000, 3);

  expect(() => simulador.registrarProceso(proceso)).toThrow();
});

test("rechaza tiempo de CPU no entero", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 500, 5.5);

  simulador.configurar(1000, 3);

  expect(() => simulador.registrarProceso(proceso)).toThrow();
});

test("reinicia el estado al reconfigurar el simulador", () => {
  const simulador = new SimuladorProcesos();
  const proceso = new Proceso(1, 200, 3);

  simulador.configurar(1000, 2);
  simulador.registrarProceso(proceso);
  simulador.tick();

  simulador.configurar(2000, 4);

  expect(simulador.obtenerTick()).toBe(0);
  expect(simulador.obtenerProcesoCPU()).toBeNull();
  expect(simulador.obtenerProcesosListos()).toHaveLength(0);
  expect(simulador.obtenerProcesosTerminados()).toHaveLength(0);
  expect(simulador.obtenerOcupacionMemoria()).toBe(0);
  expect(simulador.obtenerUtilizacionCPU()).toBe(0);
});
});