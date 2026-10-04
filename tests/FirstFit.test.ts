import { describe, expect, test } from "vitest";
import { BloqueMemoria } from "../src/BloqueMemoria.js";
import { FirstFit } from "../src/FirstFit.js";
import { Proceso } from "../src/Proceso.js";

describe("FirstFit", () => {
  test("elige el primer bloque libre que alcanza", () => {
    const estrategia = new FirstFit();
    const proceso = new Proceso(1, 200, 5);

    const bloque1 = new BloqueMemoria(0, 100);
    const bloque2 = new BloqueMemoria(100, 300);
    const bloque3 = new BloqueMemoria(400, 500, proceso);

    const resultado = estrategia.buscarBloque(
      [bloque1, bloque2, bloque3],
      200
    );

    expect(resultado).toBe(bloque2);
  });

  test("devuelve null si ningún bloque libre alcanza", () => {
  const estrategia = new FirstFit();

  const bloque1 = new BloqueMemoria(0, 100);
  const bloque2 = new BloqueMemoria(100, 200);

  const resultado = estrategia.buscarBloque(
    [bloque1, bloque2],
    300
  );

  expect(resultado).toBeNull();
});

test("ignora los bloques ocupados", () => {
  const estrategia = new FirstFit();
  const proceso = new Proceso(1, 200, 5);

  const bloqueOcupado = new BloqueMemoria(0, 500, proceso);
  const bloqueLibre = new BloqueMemoria(500, 300);

  const resultado = estrategia.buscarBloque(
    [bloqueOcupado, bloqueLibre],
    200
  );

  expect(resultado).toBe(bloqueLibre);
});
});