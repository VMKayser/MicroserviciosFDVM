# Práctica N.º 2 — Docker y Microservicios
**Asignatura:** COM-600 · Microservicios  
**Universidad:** Universidad San Francisco Xavier de Chuquisaca  

---

## 📁 Estructura del Directorio

\`\`\`text
laboratorios/02-docker/
├── Practica 2. Docker - Enunciado.pdf    # Enunciado oficial de la práctica
├── practica2-docker/                     # Parte 1: Práctica Guiada (Labs 0 al 7)
│   ├── api/                              # Microservicio API Node.js + Express
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── package.json
│   │   └── app.js
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
├── ejercicios-propuestos/                # Parte 2: Ejercicios de resolución individual
│   ├── 01-dockerizar-app/                # Ejercicio 1: Dockerizar una app propia (8 pts)
│   ├── 02-optimizacion/                  # Ejercicio 2: Optimización de Dockerfile (10 pts)
│   ├── 03-persistencia/                  # Ejercicio 3: Ciclo de persistencia y respaldo.sh (10 pts)
│   ├── 04-aislamiento-red/              # Ejercicio 4: Aislamiento con dos redes en Compose (8 pts)
│   ├── 05-proxy-balanceo/                # Ejercicio 5: Proxy Nginx y balanceo con 3 réplicas (12 pts)
│   └── 06-proyecto-integrador/           # Ejercicio 6: Stack completo documentado (12 pts)
├── capturas_evidencias/                  # Capturas para la Hoja de Evidencias (20 capturas)
└── informe/                              # Informe final y Hoja de Evidencias en PDF
\`\`\`

---

## 📌 Resumen de Entregables

1. **Hoja de Evidencias (PDF)**: Con las 20 capturas de pantalla de la Parte 1 y las 7 preguntas de comprobación respondidas.
2. **Repositorio Git**: Código completo en la carpeta \`practica2-docker\` y en \`ejercicios-propuestos/\` (sin archivos \`.env\` reales con secretos ni \`node_modules\`).
3. **Informe de la Parte 2 (PDF)**: Resolución de los 6 ejercicios con sus capturas y las 10 preguntas de reflexión.
