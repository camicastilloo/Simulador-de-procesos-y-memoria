import type { IGestorMemoria } from "./interfaces/IGestorMemoria.js";
import type { IBloqueMemoria } from "./interfaces/IBloqueMemoria.js";
import type { IProceso } from "./interfaces/IProceso.js";
import type { IEstrategiaAsignacion } from "./interfaces/IEstrategiaAsignacion.js";
import { BloqueMemoria } from "./BloqueMemoria.js";

export class GestorMemoria implements IGestorMemoria {
  private readonly bloques: BloqueMemoria[];
  private readonly estrategia: IEstrategiaAsignacion;

  constructor(
    tamanioTotal: number,
    estrategia: IEstrategiaAsignacion
  ) {
    this.bloques = [
      new BloqueMemoria(0, tamanioTotal)
    ];
    this.estrategia = estrategia;
  }

  asignarMemoria(proceso: IProceso): boolean {
  const tamanio = proceso.obtenerMemoriaRequerida();

  const bloque = this.estrategia.buscarBloque(
    this.bloques,
    tamanio
  );

  if (bloque === null) {
    return false;
  }

  const indice = this.bloques.findIndex(
  actual => actual === bloque
);
  const inicio = bloque.obtenerInicio();
  const tamanioBloque = bloque.obtenerTamanio();

  bloque.asignarProceso(proceso);

  if (tamanioBloque > tamanio) {
    const bloqueLibre = new BloqueMemoria(
      inicio + tamanio,
      tamanioBloque - tamanio
    );

    this.bloques.splice(indice + 1, 0, bloqueLibre);
  }

  return true;
}

  liberarMemoria(proceso: IProceso): void {
  const indice = this.bloques.findIndex(
    bloque => bloque.obtenerProceso() === proceso
  );

  if (indice === -1) {
    return;
  }

  this.bloques[indice]?.liberar();

  this.coalescer();
}

  obtenerBloques(): IBloqueMemoria[] {
    return [...this.bloques];
  }
  private coalescer(): void {
  for (let i = this.bloques.length - 1; i > 0; i--) {
    const actual = this.bloques[i];
    const anterior = this.bloques[i - 1];

    if (actual?.estaLibre() && anterior?.estaLibre()) {
      const nuevoTamanio =
        anterior.obtenerTamanio() + actual.obtenerTamanio();

      this.bloques.splice(i - 1, 2);

      this.bloques.splice(
        i - 1,
        0,
        new BloqueMemoria(
          anterior.obtenerInicio(),
          nuevoTamanio
        )
      );
    }
  }
}
}