export interface IProceso {
  obtenerPid(): number;
  obtenerMemoriaRequerida(): number;
  obtenerTiempoTotalCPU(): number;
}