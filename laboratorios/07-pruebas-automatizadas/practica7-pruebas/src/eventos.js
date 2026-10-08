function construirEventoTareaCreada(tarea) {
  return {
    id: tarea.id,
    titulo: tarea.titulo,
    creadaEn: new Date().toISOString()
  };
}

module.exports = { construirEventoTareaCreada };
