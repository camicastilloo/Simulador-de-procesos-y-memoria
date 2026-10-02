export interface ISimuladorProcesos {
  configurar(tamanioMemoria: number, quantum: number): void;
  obtenerTick(): number;
  obtenerMemoria(): number;
  obtenerProcesoCPU(): unknown | null;
}