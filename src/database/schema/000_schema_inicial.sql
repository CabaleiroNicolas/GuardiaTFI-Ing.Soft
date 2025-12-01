-- ==========================================================
-- SCRIPT IDEMPOTENTE PARA INICIALIZACIÓN DE DB
-- Ejecutable en cada inicio de la aplicación
-- ==========================================================

-- ==========================================================
-- TABLA OBRAS SOCIALES
-- ==========================================================
CREATE TABLE IF NOT EXISTS obras_sociales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL -- Se agrega UNIQUE para la idempotencia de los datos
);

-- ==========================================================
-- TABLA PACIENTES
-- ==========================================================
CREATE TABLE IF NOT EXISTS pacientes (
    id SERIAL PRIMARY KEY,
    cuil VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,

    calle TEXT,
    numero_direccion VARCHAR(5),
    localidad VARCHAR(100),

    numero_afiliado VARCHAR(10),
    obra_social_id INTEGER REFERENCES obras_sociales(id) ON DELETE SET NULL
);

-- ==========================================================
-- TABLA AFILIADOS
-- ==========================================================
CREATE TABLE IF NOT EXISTS afiliados (
    id SERIAL PRIMARY KEY,
    cuil VARCHAR(20) NOT NULL,
    obra_social_id INTEGER NOT NULL REFERENCES obras_sociales(id) ON DELETE CASCADE,
    numero_afiliado VARCHAR(10) NOT NULL
);

-- ==========================================================
-- TABLA ENFERMERAS
-- ==========================================================
CREATE TABLE IF NOT EXISTS enfermeras (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    cuil VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'ENFERMERA' CHECK (rol = 'ENFERMERA')
);

-- ==========================================================
-- TABLA INGRESOS
-- ==========================================================
CREATE TABLE IF NOT EXISTS ingresos (
    id SERIAL PRIMARY KEY,

    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    enfermera_id INTEGER NOT NULL REFERENCES enfermeras(id) ON DELETE SET NULL,

    fecha_ingreso TIMESTAMP NOT NULL DEFAULT NOW(),
    informe TEXT NOT NULL,

    -- Nivel de emergencia
    nivel_emergencia VARCHAR(20) NOT NULL CHECK (nivel_emergencia IN ('Critico', 'Emergencia', 'Urgencia', 'Urgencia Menor', 'Sin Urgencia')),

    -- Signos vitales
    temperatura NUMERIC(4,1) NOT NULL,
    frecuencia_cardiaca NUMERIC(4,1) NOT NULL,
    frecuencia_respiratoria NUMERIC(4,1) NOT NULL,
    tension_arterial VARCHAR(10) NOT NULL, -- ej: 120/80

    -- Estado del ingreso
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('PENDIENTE','EN PROCESO','FINALIZADO'))
);

-- ==========================================================
-- ÍNDICES IDEMPOTENTES
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_ingresos_nivel ON ingresos (nivel_emergencia);
CREATE INDEX IF NOT EXISTS idx_ingresos_fecha ON ingresos (fecha_ingreso);

-- ==========================================================
-- DATOS INICIALES (Uso de ON CONFLICT DO NOTHING)
-- ==========================================================

-- 1. Obras Sociales
INSERT INTO obras_sociales (nombre)
VALUES
    ('OSDE'),
    ('Swiss Medical'),
    ('PAMI'),
    ('Galeno'),
    ('Medicus')
ON CONFLICT (nombre) DO NOTHING;

-- 2. Enfermeras
INSERT INTO enfermeras (cuil, matricula, nombre, apellido, email, password_hash)
VALUES
('20-44444444-1', '34', 'Martina', 'Stoessel', 'martina.stoessel@example.com', '$2b$12$JWMFGf/U6A7o9I0RP1GpPuak.dld0uWau1b3VfIjLLdDL1q8igtEi') -- Contraseña: test
ON CONFLICT (cuil) DO NOTHING; -- Conflict por el campo UNIQUE(cuil)

-- 3. Pacientes
-- Uso de subselects para garantizar que la clave foránea (obra_social_id) apunte a un ID existente.
INSERT INTO pacientes (cuil, nombre, apellido, calle, numero_direccion, localidad, numero_afiliado, obra_social_id)
VALUES
('20-12345678-1', 'Juan', 'Pérez', 'Las Heras', '955', 'San Miguel de Tucumán', null, (SELECT id FROM obras_sociales WHERE nombre = 'Subsidio')),
('20-87654321-1', 'María', 'López', 'Monteagudo', '650', 'San Miguel de Tucumán', null, (SELECT id FROM obras_sociales WHERE nombre = 'Subsidio')),
('20-22222222-1', 'Carlos', 'Ruiz', '25 de Mayo', '320', 'San Miguel de Tucumán', null, NULL) -- NULL para paciente sin obra social
ON CONFLICT (cuil) DO NOTHING; -- Conflict por el campo UNIQUE(cuil)

-- 4. Afiliados
INSERT INTO afiliados (cuil, obra_social_id, numero_afiliado)
VALUES
    ('20-11111111-1', (SELECT id FROM obras_sociales WHERE nombre = 'OSDE'), '1001'),
    ('20-22222222-2', (SELECT id FROM obras_sociales WHERE nombre = 'Swiss Medical'), '2001'),
    ('20-33333333-3', (SELECT id FROM obras_sociales WHERE nombre = 'PAMI'), '3001'),
    ('20-44444444-4', (SELECT id FROM obras_sociales WHERE nombre = 'Galeno'), '4001'),
    ('20-55555555-5', (SELECT id FROM obras_sociales WHERE nombre = 'Medicus'), '5001')
ON CONFLICT DO NOTHING;