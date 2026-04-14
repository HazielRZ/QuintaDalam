require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'qu1nta_d4laM_2o26';
const helmet = require('helmet'); // helmet anti bots
const app = express();
app.use(helmet()); //
app.use(express.json());
const port = process.env.PORT || 3000;

// Ciberseguridad rate limint
const rateLimit = require('express-rate-limit');

// limitador:
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // intentos por IP
    message: { error: 'Demasiados intentos fallidos. Intenta de nuevo en 15 minutos.' }
});



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
const verificarToken = (req, res, next) => {
    // 1. Busca el token
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({error: 'Acceso denegado: No enviaste un token'});
    }

    // 2. Extrae el token
    const token = authHeader.split(' ')[1];

    // 3. Verifica que sea un token válido
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({error: 'Token inválido o expirado'});
        }
        req.admin = decoded;
        next();
    });
};

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
app.post('/api/habitaciones', verificarToken, async (req, res) => {
    try {
        const {nombre, tipo, descripcion, precio_base, capacidad, amenidades, imagenes, disponible} = req.body;

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
app.put('/api/habitaciones/:id', verificarToken, async (req, res) => {
    try {
        const {id} = req.params;
        const {nombre, tipo, descripcion, precio_base, capacidad, amenidades, imagenes, disponible} = req.body;

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
app.delete('/api/habitaciones/:id', verificarToken, async (req, res) => {
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM habitaciones WHERE id = $1', [id]);
        res.json({mensaje: 'Habitación eliminada con éxito'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al eliminar la habitación');
    }
});

// Crear una nueva reserva
app.post('/api/reservas', async (req, res) => {
    try {

        const { captchaToken, habitacion_id, nombre_cliente, apellidos, email, telefono, fecha_entrada, fecha_salida, total } = req.body;

        // 1. VALIDACIÓN CON GOOGLE
        if (!captchaToken) {
            return res.status(400).json({ error: 'Por favor, completa el CAPTCHA para continuar.' });
        }

        const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`;
        const googleResponse = await fetch(googleVerifyUrl, { method: 'POST' });
        const googleData = await googleResponse.json();

        if (!googleData.success) {
            return res.status(400).json({ error: 'Fallo la verificación de seguridad de Google.' });
        }

        // 2. anti-overbooking
        const checkQuery = `SELECT id FROM reservas WHERE habitacion_id = $1 AND fecha_entrada < $3 AND fecha_salida > $2`;
        const checkResult = await pool.query(checkQuery, [habitacion_id, fecha_entrada, fecha_salida]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'Lo sentimos, la habitación ya no está disponible para esas fechas.' });
        }

        // 3. GUARDA RESERVA
        const nuevaReserva = await pool.query(
            `INSERT INTO reservas (habitacion_id, nombre_cliente, apellidos, email, telefono, fecha_entrada, fecha_salida, total)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [habitacion_id, nombre_cliente, apellidos, email, telefono, fecha_entrada, fecha_salida, total]
        );

        res.json({ mensaje: '¡Reserva confirmada!', reserva: nuevaReserva.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor al procesar la reserva' });
    }
});
// ==========================================
// BUSCADOR DE DISPONIBILIDAD
// ==========================================
app.get('/api/disponibilidad', async (req, res) => {
    try {
        const {llegada, salida, pax} = req.query;

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
// ==========================================
// SEGURIDAD Y LOGIN
// ==========================================


//  RUTA DE LOGIN
app.post('/api/login', loginLimiter, async (req, res) => {

    try {
        const {email, password} = req.body;

        const result = await pool.query('SELECT * FROM administradores WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({error: 'Credenciales inválidas'});
        }

        const admin = result.rows[0];

        const passwordValida = await bcrypt.compare(password, admin.password);
        if (!passwordValida) {
            return res.status(401).json({error: 'Credenciales inválidas'});
        }

        const token = jwt.sign({id: admin.id, email: admin.email}, JWT_SECRET, {expiresIn: '2h'});

        res.json({mensaje: 'Login exitoso', token});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener las reservas
app.get('/api/reservas', verificarToken, async (req, res) => {
    try {
        const query = `
            SELECT r.*, h.nombre as habitacion_nombre, h.tipo as habitacion_tipo
            FROM reservas r
            JOIN habitaciones h ON r.habitacion_id = h.id
            ORDER BY r.fecha_creacion DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener las reservas:', err.message);
        res.status(500).send('Error en el servidor al cargar reservas');
    }
});




// Iniciar el servidor
app.listen(port, () => {
    console.log(` Servidor de Quinta Dalam corriendo en http://localhost:${port}`);
});