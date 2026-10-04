import { describe, expect, test } from "vitest";
import { BloqueMemoria } from "../src/BloqueMemoria.js";
import { Proceso } from "../src/Proceso.js";

describe("BloqueMemoria", () => {
  test("crea un bloque libre", () => {
    const bloque = new BloqueMemoria(0, 500);

    expect(bloque.obtenerInicio()).toBe(0);
    expect(bloque.obtenerTamanio()).toBe(500);
    expect(bloque.estaLibre()).toBe(true);
    expect(bloque.obtenerProceso()).toBe(null);
  });

  test("asigna un proceso al bloque", () => {
    const bloque = new BloqueMemoria(100, 200);
    const proceso = new Proceso(1, 200, 5);

    bloque.asignarProceso(proceso);

    expect(bloque.estaLibre()).toBe(false);
    expect(bloque.obtenerProceso()).toBe(proceso);
  });

  test("libera un bloque ocupado", () => {
    const bloque = new BloqueMemoria(100, 200);
    const proceso = new Proceso(1, 200, 5);

    bloque.asignarProceso(proceso);
    bloque.liberar();

    expect(bloque.estaLibre()).toBe(true);
    expect(bloque.obtenerProceso()).toBe(null);
  });
});