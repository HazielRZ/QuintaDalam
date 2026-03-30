require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones en Vue
app.use(express.json()); // Permite recibir JSON

// Configuración de la Base de Datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// ==========================================
// RUTAS DE LA API (Endpoints)
// ==========================================

app.get('/api/habitaciones', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM habitaciones ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// 2. Crear una NUEVA habitación
app.post('/api/habitaciones', async (req, res) => {
    try {
        const { nombre, tipo, descripcion, precio_base, capacidad, amenidades, imagenes, disponible } = req.body;

        const nuevaHabitacion = await pool.query(
            `INSERT INTO habitaciones (nombre, tipo, descripcion, precio_base, capacidad, amenidades, imagenes, disponible) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [nombre, tipo, descripcion, precio_base, capacidad, amenidades, imagenes, disponible]
        );

        res.json(nuevaHabitacion.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor al guardar la habitación');
    }
});
// 3. ACTUALIZAR (Editar) una habitación existente
app.put('/api/habitaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, tipo, descripcion, precio_base, capacidad, amenidades, imagenes, disponible } = req.body;

        const result = await pool.query(
            `UPDATE habitaciones 
             SET nombre = $1, tipo = $2, descripcion = $3, precio_base = $4, capacidad = $5, amenidades = $6, imagenes = $7, disponible = $8 
             WHERE id = $9 RETURNING *`,
            [nombre, tipo, descripcion, precio_base, capacidad, amenidades, imagenes, disponible, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al actualizar la habitación');
    }
});

// 4. ELIMINAR una habitación
app.delete('/api/habitaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM habitaciones WHERE id = $1', [id]);
        res.json({ mensaje: 'Habitación eliminada con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al eliminar la habitación');
    }
});

// Crear una nueva reserva
app.post('/api/reservas', async (req, res) => {
    try {
        const { habitacion_id, nombre_cliente, apellidos, email, telefono, fecha_entrada, fecha_salida, total } = req.body;

        const nuevaReserva = await pool.query(
            `INSERT INTO reservas 
            (habitacion_id, nombre_cliente, apellidos, email, telefono, fecha_entrada, fecha_salida, total) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [habitacion_id, nombre_cliente, apellidos, email, telefono, fecha_entrada, fecha_salida, total]
        );

        res.json({ mensaje: '¡Reserva confirmada con éxito!', reserva: nuevaReserva.rows[0] });
    } catch (err) {
        console.error('Error al guardar reserva:', err.message);
        res.status(500).send('Error en el servidor al procesar la reserva');
    }
});
// ==========================================
// BUSCADOR DE DISPONIBILIDAD
// ==========================================
app.get('/api/disponibilidad', async (req, res) => {
    try {
        const { llegada, salida, pax } = req.query;

        // Si no mandan fechas, regresamos todas las disponibles
        if (!llegada || !salida) {
            const result = await pool.query('SELECT * FROM habitaciones WHERE disponible = true');
            return res.json(result.rows);
        }

        const query = `
            SELECT * FROM habitaciones 
            WHERE disponible = true 
            AND capacidad >= $1
            AND id NOT IN (
                SELECT habitacion_id FROM reservas 
                WHERE (fecha_entrada < $3 AND fecha_salida > $2)
            )
        `;

        const capacidadBuscada = pax === '4' ? 2 : parseInt(pax);

        const result = await pool.query(query, [capacidadBuscada, llegada, salida]);
        res.json(result.rows);

    } catch (err) {
        console.error("Error en buscador:", err.message);
        res.status(500).send('Error al buscar disponibilidad');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor de Quinta Dalam corriendo en http://localhost:${port}`);
});