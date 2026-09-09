# Tabla de Comparación: REST vs GraphQL (Laboratorio 7)

| Medida | REST | GraphQL |
| :--- | :--- | :--- |
| **Viajes de red del cliente** | 3 llamadas secuenciales | 1 única llamada |
| **Bytes descargados en total** | 264 bytes | 88 bytes |
| **Tiempo total observado** | ~0.007s | ~0.005s |
| **Campos recibidos y no usados** | 5 campos (overfetching) | 0 campos |
| **Consultas SQL del lado servidor** | 2 consultas | 2 consultas |
