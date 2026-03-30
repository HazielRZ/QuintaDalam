require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones de tu frontend en Vue
app.use(express.json()); // Permite recibir JSON en el body

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

// Iniciar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor de Quinta Dalam corriendo en http://localhost:${port}`);
});