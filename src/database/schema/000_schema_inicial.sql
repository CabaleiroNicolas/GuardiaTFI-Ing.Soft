-- ==========================================================
--  SCHEMA INICIAL PARA SISTEMA DE GUARDIA
-- ==========================================================

-- DROP DATABASE IF EXISTS guardia;
-- CREATE DATABASE guardia;

-- ==========================================================
-- TABLA OBRAS SOCIALES
-- ==========================================================
CREATE TABLE obras_sociales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- ==========================================================
-- TABLA PACIENTES
-- ==========================================================
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    cuil VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    
    calle TEXT,
    numero_direccion VARCHAR(5),
    localidad VARCHAR(100),
    
    numero_afiliado VARCHAR(10),
    obra_social_id INTEGER REFERENCES obras_sociales(id) ON DELETE SET NULL
);

-- ==========================================================
-- TABLA ENFERMERAS
-- ==========================================================
CREATE TABLE enfermeras (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    cuil VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL
);

-- ==========================================================
-- TABLA INGRESOS
-- ==========================================================

CREATE TABLE ingresos (
    id SERIAL PRIMARY KEY,

    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    enfermera_id INTEGER NOT NULL REFERENCES enfermeras(id) ON DELETE SET NULL,

    fecha_ingreso TIMESTAMP NOT NULL DEFAULT NOW(),
    informe TEXT NOT NULL,

    -- Nivel de emergencia según triage (0: Crítico, 1: Emergencia, 2: Urgencia, 3: Urgencia Menor, 4: Sin Urgencia)
    nivel_emergencia INTEGER NOT NULL CHECK (nivel_emergencia BETWEEN 0 AND 4),

    -- Signos vitales
    temperatura NUMERIC(4,1) NOT NULL,
    frecuencia_cardiaca NUMERIC(4,1) NOT NULL,
    frecuencia_respiratoria NUMERIC(4,1) NOT NULL,
    tension_arterial VARCHAR(10) NOT NULL, -- ej: 120/80

    -- Estado del ingreso
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('PENDIENTE','EN PROCESO','FINALIZADO'))
);

-- Índice para ordenar ingresos rápido por nivel
CREATE INDEX idx_ingresos_nivel ON ingresos (nivel_emergencia);

-- Índice por fecha
CREATE INDEX idx_ingresos_fecha ON ingresos (fecha_ingreso);

-- ==========================================================
-- DATOS INICIALES
-- ==========================================================

INSERT INTO enfermeras (cuil, matricula, nombre, apellido)
VALUES
('20-44444444-1', '34', 'Martina', 'Stoessel');

INSERT INTO pacientes (cuil, nombre, apellido, calle, numero_direccion, localidad, numero_afiliado, obra_social_id)
VALUES
('20-12345678-1', 'Juan', 'Pérez', 'Las Heras', '955', 'San Miguel de Tucumán', null, null),
('20-87654321-1', 'María', 'López', 'Monteagudo', '650', 'San Miguel de Tucumán', null, null),
('20-22222222-1', 'Carlos', 'Ruiz', '25 de Mayo', '320', 'San Miguel de Tucumán', null, null);

INSERT INTO obras_sociales (nombre) VALUES ('Subsidio');