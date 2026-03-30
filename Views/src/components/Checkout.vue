<template>
  <header class="checkout-header">
    <h1>Finaliza tu Reserva</h1>
  </header>

  <main class="checkout-container">
    <section class="checkout-form-section">
      <div class="form-card">

        <form @submit.prevent="procesarPago">

          <div class="checkout-step">
            <h4 class="step-title"><span class="step-number">1</span> Tus Fechas</h4>
            <div class="fechas-group">
              <div class="form-group">
                <label for="entrada">Fecha de Llegada</label>
                <input id="entrada" v-model="fechaEntrada" :min="formatoInput(hoy)" required type="date" @change="validarFechas">
              </div>
              <div class="form-group">
                <label for="salida">Fecha de Salida</label>
                <input id="salida" v-model="fechaSalida" :min="fechaEntrada" required type="date" @change="validarFechas">
              </div>
            </div>
          </div>

          <div class="checkout-step">
            <h4 class="step-title"><span class="step-number">2</span> Datos del Huésped</h4>
            <div class="datos-grid">
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
            </div>
          </div>

          <div class="checkout-step" style="border-bottom: none;">
            <h4 class="step-title"><span class="step-number">3</span> Método de Pago</h4>

            <div class="payment-methods">
              <label class="payment-option" :class="{ active: metodoPago === 'tarjeta' }">
                <input type="radio" v-model="metodoPago" value="tarjeta" name="pago">
                <div class="payment-info">
                  <span class="payment-name">💳 Tarjeta de Crédito / Débito</span>
                  <span class="payment-desc">Paga seguro ahora mismo.</span>
                </div>
              </label>

              <label class="payment-option" :class="{ active: metodoPago === 'mercadopago' }">
                <input type="radio" v-model="metodoPago" value="mercadopago" name="pago">
                <div class="payment-info">
                  <span class="payment-name">🤝 Mercado Pago</span>
                  <span class="payment-desc">Usa tu saldo o meses sin intereses.</span>
                </div>
              </label>

              <label class="payment-option" :class="{ active: metodoPago === 'hotel' }">
                <input type="radio" v-model="metodoPago" value="hotel" name="pago">
                <div class="payment-info">
                  <span class="payment-name">🛎️ Pagar en el Lobby</span>
                  <span class="payment-desc">Paga al momento de hacer Check-in.</span>
                </div>
              </label>
            </div>

            <transition name="fade">
              <div v-if="metodoPago === 'tarjeta'" class="mock-card-form">
                <div class="form-group">
                  <label>Número de Tarjeta</label>
                  <input type="text" placeholder="0000 0000 0000 0000" maxlength="19" required>
                </div>
                <div class="card-row">
                  <div class="form-group">
                    <label>Vencimiento (MM/AA)</label>
                    <input type="text" placeholder="12/28" maxlength="5" required>
                  </div>
                  <div class="form-group">
                    <label>CVV</label>
                    <input type="password" placeholder="123" maxlength="4" required>
                  </div>
                </div>
              </div>
            </transition>

            <transition name="fade">
              <div v-if="metodoPago === 'mercadopago'" class="mp-message">
                <p>Serás redirigido al entorno seguro de Mercado Pago al hacer clic en Confirmar.</p>
              </div>
            </transition>
          </div>

          <div class="form-checkbox">
            <input id="terminos" v-model="datosCliente.aceptaTerminos" required type="checkbox">
            <label for="terminos">Acepto los términos y políticas de cancelación de Quinta Dalam.</label>
          </div>

          <button class="btn-continuar" type="submit" :disabled="procesando">
            <span v-if="procesando">Procesando... ⏳</span>
            <span v-else>
              {{ metodoPago === 'hotel' ? 'Confirmar Reserva' : 'Pagar ' + formatoMoneda(total) }}
            </span>
          </button>
        </form>
      </div>
    </section>

    <aside v-if="habitacionSeleccionada" class="checkout-summary">
      <div class="summary-card">
        <div class="summary-img-wrapper">
          <img :alt="`Habitación ${habitacionSeleccionada.nombre}`"
               :src="habitacionSeleccionada.imagenes && habitacionSeleccionada.imagenes.length ? habitacionSeleccionada.imagenes[0] : '/src/images/hotel.webp'">
        </div>
        <div class="summary-body">
          <span class="room-type">{{ habitacionSeleccionada.tipo }}</span>
          <h3 class="room-name">{{ habitacionSeleccionada.nombre }}</h3>
          <div class="stay-details">
            <div class="stay-date">
              <small>Entrada</small>
              <p>{{ formatoElegante(fechaEntrada) }}</p>
            </div>
            <div class="stay-date">
              <small>Salida</small>
              <p>{{ formatoElegante(fechaSalida) }}</p>
            </div>
          </div>
          <p class="stay-duration">🕒 Estancia de <strong>{{ noches }} {{ noches === 1 ? 'noche' : 'noches' }}</strong></p>
        </div>
        <div class="precio-desglose">
          <div class="precio-linea">
            <span>{{ noches }} {{ noches === 1 ? 'noche' : 'noches' }} x {{ formatoMoneda(precioPorNoche) }}</span>
            <span>{{ formatoMoneda(subtotal) }}</span>
          </div>
          <div class="precio-linea descuento">
            <span>Descuento Web (5%)</span>
            <span>-{{ formatoMoneda(descuento) }}</span>
          </div>
          <div class="precio-total">
            <span>Total a pagar</span>
            <span>{{ formatoMoneda(total) }}</span>
          </div>
        </div>
      </div>
    </aside>

    <div v-if="procesando" class="loading-overlay">
      <div class="loading-modal">
        <div class="spinner-big">💳</div>
        <h3>{{ metodoPago === 'hotel' ? 'Confirmando Reserva...' : 'Validando pago con el banco...' }}</h3>
        <p>Por favor no cierres ni actualices esta ventana.</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const habitacionSeleccionada = ref(null)

// 1. CARGAR HABITACIÓN
onMounted(async () => {
  const idOculto = localStorage.getItem('habitacionSeleccionada')
  if (!idOculto) {
    alert('Por favor, selecciona una habitación primero.');
    router.push('/habitaciones');
    return;
  }
  try {
    const respuesta = await fetch('http://localhost:3000/api/habitaciones');
    const datos = await respuesta.json();
    const habitacionesBD = datos.map(hab => ({
      ...hab,
      precioBase: parseFloat(hab.precio_base)
    }));
    habitacionSeleccionada.value = habitacionesBD.find(h => h.id == idOculto);
    if (!habitacionSeleccionada.value) {
      router.push('/habitaciones');
    }
  } catch (error) {
    console.error(error);
  }
})

// 2. DATOS
const datosCliente = ref({ nombre: '', apellidos: '', email: '', telefono: '', aceptaTerminos: false })
const metodoPago = ref('tarjeta') // Por defecto tarjeta
const procesando = ref(false)

// 3. FECHAS Y PRECIOS
const formatoInput = (f) => `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`
const hoy = new Date()
const manana = new Date()
manana.setDate(hoy.getDate() + 1)
const fechaEntrada = ref(formatoInput(hoy))
const fechaSalida = ref(formatoInput(manana))

const validarFechas = () => {
  if (new Date(fechaSalida.value) <= new Date(fechaEntrada.value)) {
    const nueva = new Date(fechaEntrada.value); nueva.setDate(nueva.getDate() + 1);
    fechaSalida.value = formatoInput(nueva)
  }
}

const noches = computed(() => Math.max(1, Math.ceil((new Date(fechaSalida.value) - new Date(fechaEntrada.value)) / 86400000)))
const formatoElegante = (fs) => new Intl.DateTimeFormat('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(fs + 'T00:00:00'))
const formatoMoneda = (v) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v)

const precioPorNoche = computed(() => habitacionSeleccionada.value ? habitacionSeleccionada.value.precioBase : 0)
const subtotal = computed(() => noches.value * precioPorNoche.value)
const descuento = computed(() => subtotal.value * 0.05)
const total = computed(() => subtotal.value - descuento.value)

// 4. PROCESAR
const procesarPago = async () => {
  procesando.value = true;

  setTimeout(async () => {
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

      const data = await respuesta.json();

      if (respuesta.ok) {
        localStorage.removeItem('habitacionSeleccionada');
        alert('¡Reserva confirmada con éxito!');
        router.push('/');
      } else {
        alert(data.error || 'Hubo un problema al procesar tu reserva.');
      }
    } catch (error) {
      alert('Error de conexión con el servidor.');
    } finally {
      procesando.value = false;
    }
  }, 2500);
}
</script>

<style scoped>
.checkout-header {
  background: #082B59;
  color: white;
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 30px;
}
.checkout-header h1 { font-family: 'Bodoni Moda SC', serif; margin: 0; letter-spacing: 2px; }

.checkout-container {
  display: flex; gap: 2.5rem; max-width: 1100px; margin: 0 auto 60px auto; padding: 0 20px; align-items: flex-start;
}

.checkout-form-section { flex: 1.8; }
.form-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #eaeaea; }

/* Pasos del Formulario */
.checkout-step {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eaeaea;
}

.step-title {
  color: #082B59;
  font-size: 1.2rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.step-number {
  background: #A62679;
  color: white;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.9rem;
}

.fechas-group, .datos-grid, .card-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group label { display: block; font-size: 0.85rem; font-weight: bold; color: #333; margin-bottom: 8px; text-transform: uppercase; }
.form-group input { width: 100%; padding: 12px 15px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 1rem; transition: all 0.3s; box-sizing: border-box;}
.form-group input:focus { outline: none; border-color: #A62679; box-shadow: 0 0 0 3px rgba(166, 38, 121, 0.1); }

/* Métodos de Pago */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  border: 2px solid #eaeaea;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option:hover { background: #f9f9f9; }
.payment-option.active { border-color: #A62679; background: rgba(166, 38, 121, 0.05); }
.payment-option input[type="radio"] { accent-color: #A62679; transform: scale(1.2); }

.payment-info { display: flex; flex-direction: column; }
.payment-name { font-weight: bold; color: #082B59; }
.payment-desc { font-size: 0.85rem; color: #666; }

.mock-card-form { background: #f4f7fb; padding: 20px; border-radius: 8px; display: flex; flex-direction: column; gap: 15px; }
.mp-message { background: #e0f2fe; color: #0284c7; padding: 15px; border-radius: 8px; font-size: 0.9rem; text-align: center; font-weight: bold; }

.form-checkbox { display: flex; align-items: flex-start; gap: 12px; background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 30px 0; }
.form-checkbox label { font-size: 0.9rem; color: #555; cursor: pointer; }

.btn-continuar { width: 100%; padding: 16px; background: #A62679; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; text-transform: uppercase; cursor: pointer; transition: background 0.3s; }
.btn-continuar:hover:not(:disabled) { background: #082B59; }
.btn-continuar:disabled { background: #ccc; cursor: not-allowed; }

/* Resumen Derecho */
.checkout-summary { flex: 1; position: sticky; top: 20px; }
.summary-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #eaeaea; }
.summary-img-wrapper { width: 100%; height: 200px; }
.summary-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
.summary-body { padding: 25px 25px 15px; }
.room-type { font-size: 0.75rem; text-transform: uppercase; color: #A62679; font-weight: bold; }
.room-name { color: #082B59; font-family: 'Bodoni Moda SC', serif; font-size: 1.5rem; margin: 5px 0 20px; }
.stay-details { display: flex; justify-content: space-between; background: #f4f7fb; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.stay-date small { display: block; font-size: 0.75rem; color: #666; text-transform: uppercase; margin-bottom: 4px; }
.stay-date p { margin: 0; font-weight: bold; color: #333; text-transform: capitalize; }
.stay-date:last-child { text-align: right; }
.stay-duration { font-size: 0.9rem; color: #555; text-align: center; margin-bottom: 10px; }
.precio-desglose { background: #fafafa; padding: 25px; border-top: 1px dashed #ddd; }
.precio-linea { display: flex; justify-content: space-between; margin-bottom: 12px; color: #555; font-size: 0.95rem; }
.precio-linea.descuento { color: #27ae60; font-weight: bold; }
.precio-total { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 2px solid #eaeaea; font-size: 1.2rem; font-weight: bold; color: #082B59; }

/* Modal de Carga */
.loading-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(5px); }
.loading-modal { background: white; padding: 40px; border-radius: 12px; text-align: center; max-width: 400px; animation: popIn 0.3s ease; }
.spinner-big { font-size: 3rem; margin-bottom: 15px; animation: bounce 1s infinite; }
.loading-modal h3 { color: #082B59; margin-bottom: 10px; }
.loading-modal p { color: #666; font-size: 0.9rem; }

@keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 900px) {
  .checkout-container { flex-direction: column-reverse; }
  .checkout-summary { position: static; width: 100%; }
  .fechas-group, .datos-grid, .card-row { grid-template-columns: 1fr; }
}
</style>