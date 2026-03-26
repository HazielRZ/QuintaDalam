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

// Iniciar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor de Quinta Dalam corriendo en http://localhost:${port}`);
});