<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const habitacionSeleccionada = ref(null)

// 1. CARGAR LA HABITACIÓN DESDE LA BASE DE DATOS
onMounted(async () => {
  const idOculto = localStorage.getItem('habitacionSeleccionada')

  try {
    const respuesta = await fetch('http://localhost:3000/api/habitaciones');
    const datos = await respuesta.json();

    // Convertimos los precios a número para Vue
    const habitacionesBD = datos.map(hab => ({
      ...hab,
      precioBase: parseFloat(hab.precio_base)
    }));

    if (idOculto) {
      habitacionSeleccionada.value = habitacionesBD.find(h => h.id === idOculto)
    }

    // Si por algo no encuentra el ID, selecciona la primera disponible
    if (!habitacionSeleccionada.value && habitacionesBD.length > 0) {
      habitacionSeleccionada.value = habitacionesBD[0]
    }
  } catch (error) {
    console.error("Error al cargar la habitación:", error)
  }
})

// 2. VARIABLES DEL FORMULARIO DEL CLIENTE
const datosCliente = ref({
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  aceptaTerminos: false
})

// 3. LÓGICA DE FECHAS
const formatoInput = (fecha) => {
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const hoy = new Date()
const manana = new Date()
manana.setDate(hoy.getDate() + 1)

const fechaEntrada = ref(formatoInput(hoy))
const fechaSalida = ref(formatoInput(manana))

const validarFechas = () => {
  const entrada = new Date(fechaEntrada.value + 'T00:00:00')
  const salida = new Date(fechaSalida.value + 'T00:00:00')

  if (salida <= entrada) {
    const nuevaSalida = new Date(entrada)
    nuevaSalida.setDate(entrada.getDate() + 1)
    fechaSalida.value = formatoInput(nuevaSalida)
  }
}

const noches = computed(() => {
  const entrada = new Date(fechaEntrada.value + 'T00:00:00')
  const salida = new Date(fechaSalida.value + 'T00:00:00')
  const diferenciaTiempo = salida.getTime() - entrada.getTime()
  const dias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24))
  return dias > 0 ? dias : 1
})

const formatoElegante = (fechaString) => {
  const fecha = new Date(fechaString + 'T00:00:00')
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  }).format(fecha)
}

// 4. LÓGICA DE PRECIOS
const porcentajeDescuento = ref(0.05)

const precioPorNoche = computed(() => {
  if (!habitacionSeleccionada.value) return 0
  return habitacionSeleccionada.value.precioBase
})

const subtotal = computed(() => noches.value * precioPorNoche.value)
const descuento = computed(() => subtotal.value * porcentajeDescuento.value)
const total = computed(() => subtotal.value - descuento.value)

const formatoMoneda = (valor) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor)
}

// 5. PROCESAR EL PAGO (ENVIAR AL BACKEND)
const procesando = ref(false)

const procesarPago = async () => {
  procesando.value = true;

  const payloadReserva = {
    habitacion_id: habitacionSeleccionada.value.id,
    nombre_cliente: datosCliente.value.nombre,
    apellidos: datosCliente.value.apellidos,
    email: datosCliente.value.email,
    telefono: datosCliente.value.telefono,
    fecha_entrada: fechaEntrada.value,
    fecha_salida: fechaSalida.value,
    total: total.value
  };

  try {
    const respuesta = await fetch('http://localhost:3000/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadReserva)
    });

    if (respuesta.ok) {
      alert(`¡Gracias ${datosCliente.value.nombre}! Tu reserva ha sido confirmada.`);
      // Limpiamos el carrito y mandamos al home
      localStorage.removeItem('habitacionSeleccionada');
      router.push('/');
    } else {
      alert('Hubo un problema al procesar tu reserva. Intenta nuevamente.');
    }
  } catch (error) {
    console.error(error);
    alert('Error de conexión al procesar el pago.');
  } finally {
    procesando.value = false;
  }
}
</script>

<template>
  <main class="checkout-container">

    <section class="checkout-form">
      <h2>Detalles de la Reserva</h2>
      <p style="margin-bottom: 20px; color: #555;">Por favor, completa tus datos para confirmar tu estadía.</p>

      <form @submit.prevent="procesarPago">
        <h4 style="margin-bottom: 10px; color: var(--magenta-deep);">Tus Fechas</h4>
        <div class="fechas-group" style="display: flex; gap: 15px; margin-bottom: 20px;">
          <div class="form-group" style="flex: 1;">
            <label for="entrada">Fecha de Entrada</label>
            <input id="entrada" v-model="fechaEntrada" :min="formatoInput(hoy)" required type="date"
                   @change="validarFechas">
          </div>
          <div class="form-group" style="flex: 1;">
            <label for="salida">Fecha de Salida</label>
            <input id="salida" v-model="fechaSalida" :min="fechaEntrada" required type="date" @change="validarFechas">
          </div>
        </div>

        <h4 style="margin-bottom: 10px; color: var(--magenta-deep);">Tus Datos</h4>
        <div class="form-group">
          <label for="nombre">Nombre(s)</label>
          <input id="nombre" v-model="datosCliente.nombre" placeholder="Ej. Juan" required type="text">
        </div>

        <div class="form-group">
          <label for="apellidos">Apellidos</label>
          <input id="apellidos" v-model="datosCliente.apellidos" placeholder="Ej. Pérez" required type="text">
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input id="email" v-model="datosCliente.email" placeholder="correo@ejemplo.com" required type="email">
        </div>

        <div class="form-group">
          <label for="telefono">Teléfono</label>
          <input id="telefono" v-model="datosCliente.telefono" placeholder="10 dígitos" required type="tel">
        </div>

        <div class="form-checkbox" style="margin: 20px 0;">
          <input id="terminos" v-model="datosCliente.aceptaTerminos" required type="checkbox">
          <label for="terminos" style="margin-left: 10px;">Acepto los términos y políticas del Hotel Quinta
            Dalam.</label>
        </div>

        <button class="btn btn-continuar" type="submit">Continuar a Pago</button>
      </form>
    </section>

    <aside v-if="habitacionSeleccionada" class="checkout-summary">
      <div class="card">
        <img :alt="`Habitación ${habitacionSeleccionada.nombre}`" :src="habitacionSeleccionada.imagenes[0]">

        <div class="card-body">
          <h3 style="color: var(--magenta-deep);">{{ habitacionSeleccionada.id }} - {{
              habitacionSeleccionada.nombre
            }}</h3>
          <ul class="features summary-features">
            <li style="text-transform: capitalize;">Entrada: {{ formatoElegante(fechaEntrada) }}</li>
            <li style="text-transform: capitalize;">Salida: {{ formatoElegante(fechaSalida) }}</li>
            <li><strong>Estancia de {{ noches }} {{ noches === 1 ? 'noche' : 'noches' }}</strong></li>
          </ul>
        </div>

        <div class="precio-desglose">
          <div class="promo-banner">Meses sin intereses disponibles</div>
          <div class="precio-linea">
            <span>{{ noches }} {{ noches === 1 ? 'noche' : 'noches' }} x {{ formatoMoneda(precioPorNoche) }}:</span>
            <span>{{ formatoMoneda(subtotal) }}</span>
          </div>
          <div class="precio-linea descuento">
            <span>Descuento Web (5%):</span>
            <span>-{{ formatoMoneda(descuento) }}</span>
          </div>
          <div class="precio-total">
            <span>Total a pagar</span>
            <span>{{ formatoMoneda(total) }} MXN</span>
          </div>
        </div>
      </div>
    </aside>

  </main>
</template>

<style scoped>
/* Encabezado */
.checkout-header h1 {
  font-family: 'Bodoni Moda SC', serif;
  margin: 0;
  letter-spacing: 2px;
}

/* Contenedor Principal */
.checkout-container {
  display: flex;
  gap: 2.5rem;
  max-width: 1100px;
  margin: 0 auto 60px auto;
  padding: 0 20px;
  align-items: flex-start; /* Importante para el aside sticky */
}

/* Columna Izquierda (Formulario) */

.form-card h2 {
  color: #082B59;
  margin-top: 0;
  margin-bottom: 5px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #A62679;
  box-shadow: 0 0 0 3px rgba(166, 38, 121, 0.1);
}

.form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin: 30px 0;
}

.form-checkbox label {
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
  line-height: 1.4;
}

.btn-continuar {
  width: 100%;
  padding: 16px;
  background: #A62679;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.btn-continuar:hover {
  background: #8b1f64;
  transform: translateY(-2px);
}

/* Columna Derecha (Resumen Sticky) */
.checkout-summary {
  flex: 1;
  position: sticky;
  top: 20px; /* Hace que el recibo baje contigo al hacer scroll */
}

.summary-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #eaeaea;
}

.summary-img-wrapper {
  width: 100%;
  height: 200px;
}

.summary-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-body {
  padding: 25px 25px 15px;
}

.room-type {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
  font-weight: bold;
}

.room-name {
  color: #082B59;
  font-family: 'Bodoni Moda SC', serif;
  font-size: 1.5rem;
  margin: 5px 0 20px;
}

.stay-details {
  display: flex;
  justify-content: space-between;
  background: #f4f7fb;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.stay-date small {
  display: block;
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.stay-date p {
  margin: 0;
  font-weight: bold;
  color: #333;
  text-transform: capitalize;
}

.stay-date:last-child {
  text-align: right;
}

.stay-duration {
  font-size: 0.9rem;
  color: #555;
  text-align: center;
  margin-bottom: 10px;
}

/* Desglose de Precios */
.precio-desglose {
  background: #fafafa;
  padding: 25px;
  border-top: 1px dashed #ddd;
}

.promo-banner {
  background: rgba(166, 38, 121, 0.1);
  color: #A62679;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.precio-linea {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #555;
  font-size: 0.95rem;
}

.precio-linea.descuento {
  color: #27ae60;
  font-weight: bold;
}

.precio-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #eaeaea;
  font-size: 1.2rem;
  font-weight: bold;
  color: #082B59;
}

.precio-total span:last-child {
  font-size: 1.5rem;
  color: #A62679;
}

.precio-total small {
  font-size: 0.9rem;
  color: #666;
}

/* Responsive */
@media (max-width: 900px) {
  .checkout-container {
    flex-direction: column-reverse; /* El carrito aparece arriba en móvil */
  }

  .checkout-summary {
    position: static;
    width: 100%;
  }

  .form-card {
    padding: 25px;
  }

  .fechas-group, .datos-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>