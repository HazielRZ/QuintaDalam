<script setup>
import { computed, ref, onMounted } from 'vue'
// IMPORTANTE: Verifica que esta ruta a tu JSON sea la correcta
import habitacionesData from '../Json/habitaciones.json'

const habitacionSeleccionada = ref(null)

// 1. LÓGICA DE BÚSQUEDA DE LA HABITACIÓN
onMounted(() => {
  const idOculto = localStorage.getItem('habitacionSeleccionada')
  if (idOculto) {
    habitacionSeleccionada.value = habitacionesData.find(h => h.id == idOculto)
  }
  if (!habitacionSeleccionada.value) {
    habitacionSeleccionada.value = habitacionesData[0]
  }
})

// 2. VARIABLES DEL FORMULARIO DEL CLIENTE
const datos = ref({
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  aceptaTerminos: false
})

// 3. LÓGICA DE FECHAS
// Función para dar formato "YYYY-MM-DD" para los <input type="date">
const formatoInput = (fecha) => {
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const hoy = new Date()
const manana = new Date()
manana.setDate(hoy.getDate() + 1)

// Variables reactivas para las fechas
const fechaEntrada = ref(formatoInput(hoy))
const fechaSalida = ref(formatoInput(manana))

//  ajustar la salida automáticamente
const validarFechas = () => {
  const entrada = new Date(fechaEntrada.value + 'T00:00:00')
  const salida = new Date(fechaSalida.value + 'T00:00:00')

  if (salida <= entrada) {
    const nuevaSalida = new Date(entrada)
    nuevaSalida.setDate(entrada.getDate() + 1)
    fechaSalida.value = formatoInput(nuevaSalida)
  }
}

//  días de diferencia
const noches = computed(() => {
  const entrada = new Date(fechaEntrada.value + 'T00:00:00')
  const salida = new Date(fechaSalida.value + 'T00:00:00')
  const diferenciaTiempo = salida.getTime() - entrada.getTime()
  const dias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24))
  return dias > 0 ? dias : 1 // Mínimo 1 noche
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
  const precioLimpio = String(habitacionSeleccionada.value.precioBase).replace(/,/g, '')
  return parseFloat(precioLimpio)
})

const subtotal = computed(() => noches.value * precioPorNoche.value)
const descuento = computed(() => subtotal.value * porcentajeDescuento.value)
const total = computed(() => subtotal.value - descuento.value)

const formatoMoneda = (valor) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor)
}

const procesarPago = () => {
  alert(`¡Procesando reserva a nombre de ${datos.value.nombre} por ${noches.value} noches. Total: ${formatoMoneda(total.value)}!`)
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
            <input type="date" id="entrada" v-model="fechaEntrada" @change="validarFechas" :min="formatoInput(hoy)" required>
          </div>
          <div class="form-group" style="flex: 1;">
            <label for="salida">Fecha de Salida</label>
            <input type="date" id="salida" v-model="fechaSalida" @change="validarFechas" :min="fechaEntrada" required>
          </div>
        </div>

        <h4 style="margin-bottom: 10px; color: var(--magenta-deep);">Tus Datos</h4>
        <div class="form-group">
          <label for="nombre">Nombre(s)</label>
          <input type="text" id="nombre" v-model="datos.nombre" required placeholder="Ej. Juan">
        </div>

        <div class="form-group">
          <label for="apellidos">Apellidos</label>
          <input type="text" id="apellidos" v-model="datos.apellidos" required placeholder="Ej. Pérez">
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="datos.email" required placeholder="correo@ejemplo.com">
        </div>

        <div class="form-group">
          <label for="telefono">Teléfono</label>
          <input type="tel" id="telefono" v-model="datos.telefono" required placeholder="10 dígitos">
        </div>

        <div class="form-checkbox" style="margin: 20px 0;">
          <input type="checkbox" id="terminos" v-model="datos.aceptaTerminos" required>
          <label for="terminos" style="margin-left: 10px;">Acepto los términos y políticas del Hotel Quinta Dalam.</label>
        </div>

        <button class="btn btn-continuar" type="submit">Continuar a Pago</button>
      </form>
    </section>

    <aside class="checkout-summary" v-if="habitacionSeleccionada">
      <div class="card">
        <img :alt="`Habitación ${habitacionSeleccionada.nombre}`" :src="habitacionSeleccionada.imagenes[0]">

        <div class="card-body">
          <h3 style="color: var(--magenta-deep);">{{ habitacionSeleccionada.id }} - {{ habitacionSeleccionada.nombre }}</h3>
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

.checkout-container {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.checkout-form {
  flex: 2;
}

.checkout-summary {
  flex: 1;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
}

@media (max-width: 768px) {
  .checkout-container {
    flex-direction: column-reverse;
  }
  .fechas-group {
    flex-direction: column;
  }
}
</style>