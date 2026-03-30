# Quinta Dalam - Hotel Management & Booking System

Sistema integral web (Full-Stack) para la gestión de reservas, catálogo de habitaciones y administración interna del Hotel Quinta Dalam. Desarrollado con una arquitectura cliente-servidor, enfocado en la experiencia de usuario (UX), seguridad de datos y prevención de colisiones en reservaciones (Anti-Overbooking).

## 🛠️ Stack Tecnológico

**Frontend (Client-Side)**
* **Framework:** Vue.js 3 (Composition API / `<script setup>`)
* **Enrutamiento:** Vue Router (con Navigation Guards)
* **Build Tool:** Vite
* **Estilos:** Vanilla CSS (Global & Scoped, metodología BEM adaptada)
* **Librerías Extra:** `html2pdf.js` (Generación de comprobantes en el cliente)

**Backend (Server-Side & API)**
* **Entorno:** Node.js
* **Framework:** Express.js
* **Autenticación:** JSON Web Tokens (JWT)
* **Seguridad:** `bcrypt` (Hashing de contraseñas), validación de Middleware
* **CORS:** Habilitado para comunicación cross-origin

**Base de Datos**
* **Motor:** PostgreSQL (Relacional)
* **Conector:** `pg` (Node-Postgres) con consultas parametrizadas para evitar Inyección SQL.

---

## 🚀 Características Principales (Features)

### 1. Módulo del Cliente (B2C)
* **Motor de Disponibilidad:** Búsqueda dinámica de habitaciones validando en tiempo real las fechas de entrada/salida contra la base de datos para evitar cruces.
* **Catálogo Dinámico:** Renderizado de habitaciones en tiempo real obtenidas desde la API REST.
* **Checkout Multi-paso:** Flujo de compra con validación de fechas, cálculo dinámico de noches, subtotales, impuestos y aplicación de descuentos.
* **Simulación de Pasarela de Pagos:** UI/UX realista con estados de carga (Loading states) para validación bancaria asíncrona.
* **Generación de Tickets:** Renderizado de comprobantes de reserva en formato PDF directamente desde el DOM mediante Canvas/jsPDF.

### 2. Módulo Administrativo (Backoffice)
* **Autenticación Segura:** Sistema de Login protegido por JWT y contraseñas hasheadas.
* **Dashboard / Lobby:** Panel de control centralizado para la navegación administrativa.
* **Gestión de Catálogo (CRUD):** Creación, lectura, actualización y eliminación lógica/física de habitaciones. Peticiones protegidas mediante validación de cabeceras `Authorization: Bearer <token>`.
* **Control de Reservas:** Visualización tabular del historial de compras, información de contacto de huéspedes e ingresos generados.

### 3. Seguridad y Lógica de Negocio
* **Protección Anti-Overbooking:** Lógica a nivel de base de datos (`SELECT ... WHERE fecha_entrada < $3 AND fecha_salida > $2`) que bloquea peticiones concurrentes para las mismas fechas.
* **Middlewares de Ruta:** Interceptores en Express para rechazar peticiones HTTP que no contengan un Token JWT válido o no expirado.
* **Guardián de Rutas (Vue Router):** Redirección automática al Login si un usuario no autorizado intenta acceder a las vistas bajo `/admin` o `/alta`.

---

## ⚙️ Estructura de la Base de Datos (PostgreSQL)

El sistema utiliza un modelo relacional con las siguientes tablas principales:
1. `administradores`: Manejo de credenciales (id, email, password_hash).
2. `habitaciones`: Catálogo con capacidades, amenidades tipo Array y precios.
3. `reservas`: Historial transaccional con llave foránea a `habitaciones`, datos del huésped y montos exactos (`DECIMAL`).

---
