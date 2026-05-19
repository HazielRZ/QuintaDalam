-- ==========================================
-- BASE DE DATOS: quinta_dalam
-- SCRIPT DE CREACIÓN DE TABLAS
-- ==========================================

-- 1. TABLA DE HABITACIONES
-- (Se crea primero porque no depende de ninguna otra tabla)
CREATE TABLE habitaciones (
                              id SERIAL PRIMARY KEY,
                              nombre VARCHAR(100) NOT NULL,
                              tipo VARCHAR(50) NOT NULL,
                              descripcion TEXT NOT NULL,
                              precio_base DECIMAL(10,2) NOT NULL,
                              capacidad INT NOT NULL,
                              amenidades TEXT[] NOT NULL,
                              imagenes TEXT[] NOT NULL,
                              disponible BOOLEAN DEFAULT true
);

-- 2. TABLA DE ADMINISTRADORES
-- (Maneja el acceso al panel de control B2B)
CREATE TABLE administradores (
                                 id SERIAL PRIMARY KEY,
                                 email VARCHAR(100) UNIQUE NOT NULL,
                                 password VARCHAR(255) NOT NULL
);

-- 3. TABLA DE RESERVAS
-- (Depende de habitaciones para el habitacion_id)
CREATE TABLE reservas (
                          id SERIAL PRIMARY KEY,
                          habitacion_id INT REFERENCES habitaciones(id) ON DELETE CASCADE,
                          nombre_cliente VARCHAR(100) NOT NULL,
                          apellidos VARCHAR(100) NOT NULL,
                          email VARCHAR(100) NOT NULL,
                          telefono VARCHAR(20) NOT NULL,
                          fecha_entrada DATE NOT NULL,
                          fecha_salida DATE NOT NULL,
                          total DECIMAL(10,2) NOT NULL,
                          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- DATOS DE PRUEBA
-- Ejecutar esto si se desea tener un usuario admin listo para usar
-- ==========================================

-- Nota: La contraseña está cifrada con Bcrypt.
-- El texto plano de esta contraseña es: Admin123!
INSERT INTO administradores (email, password)
VALUES ('admin@quintadalam.com', '$2b$10$wE/L1x8Zq6zD6Nl/hO9C.ebUjYh/E9J6dIqJ6N4x.5K1z1/eG2z0K')
ON CONFLICT (email) DO NOTHING;


