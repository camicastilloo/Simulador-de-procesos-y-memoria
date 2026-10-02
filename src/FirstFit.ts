import type { IEstrategiaAsignacion } from "./interfaces/IEstrategiaAsignacion.js";
import type { IBloqueMemoria } from "./interfaces/IBloqueMemoria.js";

export class FirstFit implements IEstrategiaAsignacion {
  buscarBloque(
    bloques: IBloqueMemoria[],
    tamRequerido: number
  ): IBloqueMemoria | null {
    for (const bloque of bloques) {
      if (bloque.estaLibre() && bloque.obtenerTamanio() >= tamRequerido) {
        return bloque;
      }
    }

    return null;
  }
}