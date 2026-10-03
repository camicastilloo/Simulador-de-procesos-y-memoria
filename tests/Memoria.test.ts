import { describe, expect, test } from "vitest";
import { GestorMemoria } from "../src/GestorMemoria.js";
import { FirstFit } from "../src/FirstFit.js";
import { Proceso } from "../src/Proceso.js";
import { EstadoProceso } from "../src/EstadoProceso.js";

describe("GestorMemoria", () => {
  test("une tres bloques libres consecutivos", () => {
    const gestor = new GestorMemoria(1000, new FirstFit());

    const proceso1 = new Proceso(1, 200, 5);
    const proceso2 = new Proceso(2, 200, 5);
    const proceso3 = new Proceso(3, 200, 5);

    gestor.asignarMemoria(proceso1);
    gestor.asignarMemoria(proceso2);
    gestor.asignarMemoria(proceso3);

    gestor.liberarMemoria(proceso1);
    gestor.liberarMemoria(proceso2);
    gestor.liberarMemoria(proceso3);

    const bloques = gestor.obtenerBloques();

    expect(bloques).toHaveLength(1);
    expect(bloques[0]?.obtenerInicio()).toBe(0);
    expect(bloques[0]?.obtenerTamanio()).toBe(1000);
    expect(bloques[0]?.estaLibre()).toBe(true);
  });

  test("asigna memoria y divide el bloque libre", () => {
  const gestor = new GestorMemoria(1000, new FirstFit());
  const proceso = new Proceso(1, 300, 5);

  const asignado = gestor.asignarMemoria(proceso);

  expect(asignado).toBe(true);

  const bloques = gestor.obtenerBloques();

  expect(bloques).toHaveLength(2);
  expect(bloques[0]?.obtenerInicio()).toBe(0);
  expect(bloques[0]?.obtenerTamanio()).toBe(300);
  expect(bloques[0]?.obtenerProceso()).toBe(proceso);

  expect(bloques[1]?.obtenerInicio()).toBe(300);
  expect(bloques[1]?.obtenerTamanio()).toBe(700);
  expect(bloques[1]?.estaLibre()).toBe(true);
});

test("rechaza una asignación si no hay un bloque suficientemente grande", () => {
  const gestor = new GestorMemoria(1000, new FirstFit());

  const proceso1 = new Proceso(1, 600, 5);
  const proceso2 = new Proceso(2, 500, 5);

  expect(gestor.asignarMemoria(proceso1)).toBe(true);

  const bloquesAntes = gestor.obtenerBloques();

  expect(gestor.asignarMemoria(proceso2)).toBe(false);

  const bloquesDespues = gestor.obtenerBloques();

  expect(bloquesDespues).toHaveLength(bloquesAntes.length);
  expect(bloquesDespues[0]?.obtenerTamanio()).toBe(
    bloquesAntes[0]?.obtenerTamanio()
  );
  expect(bloquesDespues[1]?.obtenerTamanio()).toBe(
    bloquesAntes[1]?.obtenerTamanio()
  );
  expect(proceso2.obtenerEstado()).toBe(EstadoProceso.NUEVO);
});
});