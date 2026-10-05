CREATE DATABASE IF NOT EXISTS clinica
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE clinica;

CREATE TABLE IF NOT EXISTS pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ci VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  telefono VARCHAR(20) NULL,
  seguro VARCHAR(2) NOT NULL DEFAULT 'NO'
);

INSERT INTO pacientes (ci, nombre, apellido, fecha_nacimiento, telefono, seguro) VALUES
  ('12345678','juan', 'aguilar', '2004-12-01', '74243241', 'SI'),
  ('123456782','juan2', 'aguilar2', '2003-12-02', '742432412', 'SI'),
  ('123456783','juan3', 'aguilar3', '2003-12-05', '742432413', 'NO'),
  ('123456784','juan4', 'aguilar4', '2002-01-02', '742432414', 'SI'),
  ('123456785','juan5', 'aguilar5', '2001-12-01', '742432415', 'NO');
