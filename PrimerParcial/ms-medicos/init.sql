CREATE TABLE IF NOT EXISTS medicos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  especialidad VARCHAR(100) NOT NULL,
  matricula VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS horarios (
  id SERIAL PRIMARY KEY,
  medico_id INT NOT NULL REFERENCES medicos(id) ON DELETE CASCADE UNIQUE,
  fecha DATE NOT NULL UNIQUE,
  hora TIME NOT NULL UNIQUE,
  disponible VARCHAR(2) NOT NULL DEFAULT 'SI' CHECK (disponible IN ('SI', 'NO')),

);

INSERT INTO medicos (id, nombre, especialidad, matricula) VALUES
  (1, 'DON JUAN', 'Cardiologia', 'MAT-001'),
  (2, 'DON JUAN2', 'Cardiologia2', 'MAT-002'),
  (3, 'DON JUAN3', 'Cardiologia3', 'MAT-003'),
  (4, 'DON JUAN4', 'Cardiologia4', 'MAT-004');

INSERT INTO horarios (medico_id, fecha, hora, disponible) VALUES
  (1, '2026-10-01', '08:00', 'SI'),
  (1, '2026-10-01', '09:00', 'SI'),
  (1, '2026-10-01', '10:00', 'NO'),
  (2, '2026-10-01', '08:30', 'SI'),
  (2, '2026-10-02', '09:30', 'SI'),
  (3, '2026-10-02', '10:00', 'SI'),
  (3, '2026-10-02', '11:00', 'SI'),
  (4, '2026-10-03', '08:00', 'SI');