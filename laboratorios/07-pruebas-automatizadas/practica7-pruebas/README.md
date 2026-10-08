# Práctica N.º 7 — Pruebas Automatizadas en Microservicios

**Asignatura:** COM-600 Microservicios  
**Docente:** Lic. Carlos Montellano B.  
**Estudiante:** Freddy Daniel Valencia Medina  
**Carrera:** Ingeniería de Sistemas  
**Gestión:** 2/2026  

---

## 📋 Descripción del Proyecto

Este proyecto implementa una estrategia integral de pruebas automatizadas sobre una arquitectura de microservicios, cubriendo los diferentes niveles de la pirámide de pruebas:
1. **Pruebas Unitarias:** Verificación de funciones puras de lógica de negocio en milisegundos (`tarea.js`).
2. **Pruebas de Integración HTTP:** Verificación de endpoints Express usando `supertest` sin necesidad de levantar servidores ni puertos reales.
3. **Pruebas de Integración con Contenedor Efímero:** Verificación del repositorio de persistencia contra una instancia real de MongoDB aprovisionada dinámicamente con `@testcontainers/mongodb` y destruida automáticamente al finalizar.
4. **Pruebas de Contrato:** Validación de esquemas de eventos publicados (`tarea-creada.contrato.json`) para evitar rupturas de comunicación entre microservicios.

---

## ⚙️ Requisitos Previos

- **Node.js:** Versión 20 o 22 LTS (actualmente probado en Node 22.23.2).
- **npm:** Versión 10+ (probado en npm 10.9.8).
- **Docker Engine / Desktop:** Activo (para ejecución de Testcontainers con `mongo:7`).

---

## 🚀 Instalación

Clone el repositorio y acceda a la carpeta del proyecto:

```bash
cd laboratorios/07-pruebas-automatizadas/practica7-pruebas
npm install
```

---

## 🧪 Ejecución de Suites de Prueba y Tiempos Estimados

Las pruebas se encuentran separadas por velocidad y alcance:

| Comando | Tipo de Suite | Descripción | Tiempo Estimado |
|---|---|---|---|
| `npm run test:unit` | **Rápidas (Unitarias + API + Contrato)** | Corre en memoria sin dependencias externas. Ideal para ejecución en cada guardado. | **~0.6 segundos** |
| `npm run test:int` | **Lentas (Integración con BD)** | Levanta un contenedor efímero de MongoDB con Testcontainers, corre las pruebas y lo destruye. | **~6.5 segundos** |
| `npm test` | **Suite Completa** | Ejecuta todas las pruebas del proyecto en secuencia (`--runInBand`). | **~7.5 segundos** |
| `npm run test:cov` | **Cobertura** | Genera la matriz de cobertura en terminal y el reporte navegable HTML en `coverage/lcov-report`. | **~7.8 segundos** |

---

## 📊 Cobertura y Umbrales

Configurado en `jest.config.js`:
- **Líneas (lines):** Mínimo 80%
- **Ramas (branches):** Mínimo 70%
- **Funciones (functions):** Mínimo 80%
- **Sentencias (statements):** Mínimo 80%

---

## 🛡️ Criterios de Calidad para Pipelines de CI

Para permitir la fusión (*merge*) de cambios a la rama `main`:
1. **Exit Code 0:** Ninguna prueba unitaria, de integración o de contrato debe fallar (`echo $?` debe retornar `0`).
2. **Superación de Umbrales de Cobertura:** La cobertura no puede degradarse por debajo de los umbrales configurados.
3. **Verificación Estática y Sintáctica Limpia:** El código debe superar las validaciones de análisis estático sin advertencias críticas.
