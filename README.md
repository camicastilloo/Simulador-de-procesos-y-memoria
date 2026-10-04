# Simulador de procesos y memoria

Proyecto desarrollado en TypeScript para la materia **Sistemas Operativos** y **Paradigmas y Lenguajes de Programación II**.

El proyecto implementa un simulador de procesos y memoria utilizando **Programación Orientada a Objetos**, con planificación de CPU mediante **Round-Robin**, gestión de memoria contigua y simulación mediante ticks discretos.

## Funcionalidades

El simulador permite:

* Configurar el tamaño de la memoria y el quantum de CPU.
* Registrar procesos con PID, memoria requerida y tiempo total de CPU.
* Administrar los estados de los procesos:

  * NUEVO
  * ESPERANDO_MEMORIA
  * LISTO
  * EJECUTANDO
  * BLOQUEADO
  * TERMINADO
* Asignar memoria mediante la estrategia **First Fit**.
* Dividir bloques de memoria cuando el espacio disponible es mayor al requerido.
* Liberar memoria cuando un proceso termina.
* Unificar bloques libres contiguos mediante coalescencia.
* Administrar la CPU mediante planificación **Round-Robin**.
* Controlar el vencimiento del quantum.
* Simular bloqueos de procesos por operaciones de E/S.
* Registrar cambios de contexto.
* Calcular métricas de memoria y CPU.
* Consultar el estado actual del simulador mediante vistas de solo lectura.
* Ejecutar la simulación mediante ticks discretos y deterministas.

## Arquitectura

El proyecto está organizado utilizando interfaces y composición, evitando la herencia entre clases.

### Clases principales

* **Proceso**: representa un proceso y administra su estado, consumo de CPU, quantum y bloqueos.
* **BloqueMemoria**: representa un bloque de memoria y permite asignarlo o liberarlo.
* **FirstFit**: implementa la estrategia de asignación First Fit.
* **GestorMemoria**: administra los bloques de memoria, asignaciones, liberaciones y coalescencia.
* **PlanificadorCPU**: administra la cola de procesos listos, el proceso en ejecución y la planificación Round-Robin.
* **SimuladorProcesos**: coordina la memoria, CPU, procesos, ticks y métricas.

### Interfaces

Cada clase utiliza una interfaz asociada para separar la definición de comportamiento de su implementación.

Entre las principales interfaces se encuentran:

* `IProceso`
* `IBloqueMemoria`
* `IEstrategiaAsignacion`
* `IGestorMemoria`
* `IPlanificadorCPU`
* `ISimuladorProcesos`

También se utilizan interfaces de vista para evitar exponer directamente el estado interno de los objetos.

## Estructura del proyecto

```text
src/
├── interfaces/
│   ├── IBloqueMemoria.ts
│   ├── IBloqueMemoriaVista.ts
│   ├── IEstrategiaAsignacion.ts
│   ├── IGestorMemoria.ts
│   ├── IPlanificadorCPU.ts
│   ├── IProceso.ts
│   ├── IProcesoVista.ts
│   └── ISimuladorProcesos.ts
│
├── BloqueMemoria.ts
├── EstadoProceso.ts
├── FirstFit.ts
├── GestorMemoria.ts
├── PlanificadorCPU.ts
├── Proceso.ts
├── SimuladorProcesos.ts
└── index.ts

tests/
├── BloqueMemoria.test.ts
├── BloqueoProcesos.test.ts
├── CambiosContexto.test.ts
├── FirstFit.test.ts
├── Inspeccion.test.ts
├── Memoria.test.ts
├── Metricas.test.ts
├── PlanificadorCPU.test.ts
├── Proceso.test.ts
└── SimuladorProcesos.test.ts

.github/
└── workflows/
    └── tests.yml
```

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

## Ejecutar los tests

```bash
npm test
```

## Ejecutar los tests con cobertura

```bash
npm run coverage
```

El proyecto tiene configurados umbrales mínimos del **90%** para:

* Statements
* Branches
* Functions
* Lines

La cobertura actual supera estos valores.

## Verificar la compilación

Para comprobar que el código TypeScript no presenta errores:

```bash
npx tsc --noEmit
```

## Integración continua

El proyecto utiliza **GitHub Actions** para ejecutar automáticamente los tests y la cobertura cuando se realiza un `push` o un `pull request`.

El workflow:

1. Descarga el repositorio.
2. Configura Node.js.
3. Instala las dependencias mediante `npm ci`.
4. Ejecuta los tests y verifica la cobertura.

## Tecnologías utilizadas

* **TypeScript**
* **Node.js**
* **Vitest**
* **V8 Coverage**
* **GitHub Actions**
* **Git / GitHub**

## Enfoque de diseño

El proyecto aplica conceptos de Programación Orientada a Objetos como:

* Encapsulamiento.
* Abstracción mediante interfaces.
* Polimorfismo.
* Composición.
* Separación de responsabilidades.

La interacción entre los componentes se realiza principalmente mediante interfaces, permitiendo reemplazar implementaciones concretas sin modificar las clases que las utilizan.

## Estado del proyecto

Proyecto finalizado y funcional.

Todos los tests automatizados pasan correctamente y el proyecto cumple con los umbrales de cobertura configurados.
