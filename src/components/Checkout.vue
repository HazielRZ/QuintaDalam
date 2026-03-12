<script setup>
import {computed, ref} from 'vue'

// 1. VARIABLES
const reserva = ref({
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  aceptaTerminos: false
})

// 2. LÓGICA DE NEGOCIO Y PRECIOS
const noches = ref(3)
const precioPorNoche = ref(8115) // Precio base
const porcentajeDescuento = ref(0.20) // 20% de descuento por reservar en web

// 3. PROPIEDADES COMPUTADAS
const subtotal = computed(() => noches.value * precioPorNoche.value)
const descuento = computed(() => subtotal.value * porcentajeDescuento.value)
const total = computed(() => subtotal.value - descuento.value)

// Función auxiliar para dar formato de moneda (Pesos Mexicanos)
const formatoMoneda = (valor) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(valor)
}

// Función simulada para procesar el pago
const procesarPago = () => {
  console.log('Procesando pago de:', reserva.value)
  alert(`¡Redirigiendo a pasarela de pago por ${formatoMoneda(total.value)}!`)
}
</script>

<template>
  <main class="checkout-container" style="max-width: 1200px; margin: 40px auto; padding: 0 20px;">

    <section class="checkout-form-section">
      <h2 class="titulo-checkout">Datos para su reservación</h2>

      <form class="form-grid" @submit.prevent="procesarPago">
        <div class="input-group">
          <label for="name">Nombre</label>
          <input id="name" v-model="reserva.nombre" placeholder="Escribe tu(s) nombre(s)" required type="text">
        </div>

        <div class="input-group">
          <label for="lastName">Apellidos</label>
          <input id="lastName" v-model="reserva.apellidos" required type="text">
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input id="email" v-model="reserva.email" required type="email">
        </div>

        <div class="input-group">
          <label for="phone">Teléfono</label>
          <div class="phone-input">
            <select>
              <option>MX +52</option>
            </select>
            <input id="phone" v-model="reserva.telefono" placeholder="Clave Lada + Teléfono" required type="tel">
          </div>
        </div>

        <div class="politicas-reserva">
          <label>
            <input v-model="reserva.aceptaTerminos" required type="checkbox">
            He leído y acepto los <a href="#">términos y condiciones</a>.
          </label>
          <p><i class="fa-solid fa-check"></i> Has obtenido el mejor precio disponible reservando directo.</p>
        </div>

        <button class="btn btn-continuar" type="submit">Continuar a Pago</button>
      </form>
    </section>

    <aside class="checkout-summary">
      <div class="card">
        <img alt="Habitación Tzintzuntzan" src="/src/images/Habitacion.jpg">
        <div class="card-body">
          <h3 style="color: var(--magenta-deep);">101 - Tzintzuntzan</h3>
          <ul class="features summary-features">
            <li>2 adultos</li>
            <li>Entrada: sáb, 28 mar. 2026</li>
            <li>Salida: mar, 31 mar. 2026</li>
            <li><strong>Estancia de {{ noches }} noches</strong></li>
          </ul>
        </div>

        <div class="precio-desglose">
          <div class="promo-banner">Meses sin intereses disponibles</div>
          <div class="precio-linea">
            <span>{{ noches }} noches:</span>
            <span>{{ formatoMoneda(subtotal) }}</span>
          </div>
          <div class="precio-linea descuento">
            <span>Descuento Web:</span>
            <span>-{{ formatoMoneda(descuento) }}</span>
          </div>
          <div class="precio-linea total">
            <span>Total:</span>
            <span>{{ formatoMoneda(total) }}</span>
          </div>
        </div>
      </div>
    </aside>

  </main>
</template>