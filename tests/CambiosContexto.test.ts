import { describe, expect, test } from "vitest";
import { Proceso } from "../src/Proceso.js";
import { PlanificadorCPU } from "../src/PlanificadorCPU.js";

describe("Cambios de contexto", () => {
test("inicia el contador de cambios de contexto en cero", () => {
  const planificador = new PlanificadorCPU();

  expect(planificador.obtenerCambiosContexto()).toBe(0);
});

test("cuenta un cambio de contexto al vencer el quantum", () => {
  const planificador = new PlanificadorCPU();
  const proceso1 = new Proceso(1, 100, 5);
  const proceso2 = new Proceso(2, 100, 5);

  planificador.configurarQuantum(1);
  planificador.agregarProceso(proceso1);
  planificador.agregarProceso(proceso2);

  planificador.despachar();
  planificador.ejecutarUnidad();

  expect(planificador.quantumVencido()).toBe(true);

  planificador.reencolarPorQuantum();

  expect(planificador.obtenerCambiosContexto()).toBe(1);
});

test("cuenta un cambio de contexto al bloquear un proceso", () => {
  const planificador = new PlanificadorCPU();
  const proceso = new Proceso(1, 100, 5);

  planificador.configurarQuantum(3);
  proceso.configurarBloqueoCPU(1, 2);

  planificador.agregarProceso(proceso);
  planificador.despachar();
  planificador.ejecutarUnidad();

  planificador.bloquearProceso(
    proceso.obtenerDuracionBloqueo()
  );

  expect(planificador.obtenerCambiosContexto()).toBe(1);
});
});