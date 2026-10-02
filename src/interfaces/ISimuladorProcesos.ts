export interface ISimuladorProcesos {
  configurar(tamanioMemoria: number, quantum: number): void;
  obtenerTick(): number;
}