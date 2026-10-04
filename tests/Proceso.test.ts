import { describe, expect, test } from "vitest";
import { Proceso } from "../src/Proceso.js";
import { EstadoProceso } from "../src/EstadoProceso.js";

describe("Proceso", () => {
  test("inicia con sus valores básicos", () => {
    const proceso = new Proceso(1, 200, 5);

    expect(proceso.obtenerPid()).toBe(1);
    expect(proceso.obtenerMemoriaRequerida()).toBe(200);
    expect(proceso.obtenerTiempoTotalCPU()).toBe(5);
    expect(proceso.obtenerCPURestante()).toBe(5);
    expect(proceso.obtenerEstado()).toBe(EstadoProceso.NUEVO);
  });

  test("consume CPU y aumenta la CPU consumida", () => {
    const proceso = new Proceso(1, 200, 5);

    proceso.consumirCPU();

    expect(proceso.obtenerCPURestante()).toBe(4);
    expect(proceso.debeBloquearse()).toBe(false);
  });

  test("reinicia y consume el quantum", () => {
    const proceso = new Proceso(1, 200, 5);

    proceso.consumirQuantum();
    proceso.consumirQuantum();

    expect(proceso.obtenerQuantumConsumido()).toBe(2);

    proceso.reiniciarQuantum();

    expect(proceso.obtenerQuantumConsumido()).toBe(0);
  });

  test("inicia y disminuye un bloqueo", () => {
    const proceso = new Proceso(1, 200, 5);

    proceso.iniciarBloqueo(3);

    expect(proceso.obtenerEstado()).toBe(EstadoProceso.BLOQUEADO);
    expect(proceso.obtenerBloqueoRestante()).toBe(3);

    proceso.disminuirBloqueo();

    expect(proceso.obtenerBloqueoRestante()).toBe(2);
  });

  test("configura un bloqueo por consumo de CPU", () => {
  const proceso = new Proceso(1, 200, 5);

  proceso.configurarBloqueoCPU(2, 3);

  proceso.consumirCPU();
  expect(proceso.debeBloquearse()).toBe(false);

  proceso.consumirCPU();
  expect(proceso.debeBloquearse()).toBe(true);
  expect(proceso.obtenerDuracionBloqueo()).toBe(3);
});

test("rechaza una configuración de bloqueo inválida", () => {
  const proceso = new Proceso(1, 200, 5);

  expect(() => proceso.configurarBloqueoCPU(0, 3)).toThrow();
  expect(() => proceso.configurarBloqueoCPU(2, 0)).toThrow();
});
});