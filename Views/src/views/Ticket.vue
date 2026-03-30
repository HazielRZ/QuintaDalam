<template>
  <div class="ticket-wrapper">
    <div class="actions-nav">
      <RouterLink to="/" class="btn-outline">← Volver al Inicio</RouterLink>
      <button @click="descargarPDF" class="btn-primary">⬇️ Descargar PDF</button>
    </div>

    <div ref="ticketPDF" class="ticket-card">
      <div class="ticket-header">
        <div class="logo-placeholder"></div>
        <h2>Quinta Dalam</h2>
        <p>Comprobante de Reservación</p>
      </div>

      <div v-if="ticket" class="ticket-body">
        <div class="ticket-row">
          <div class="ticket-col">
            <small>Folio de Reserva</small>
            <strong>#{{ String(ticket.folio).padStart(4, '0') }}</strong>
          </div>
          <div class="ticket-col text-right">
            <small>Fecha de Emisión</small>
            <strong>{{ formatearFecha(ticket.fechaCompra) }}</strong>
          </div>
        </div>

        <hr class="divider">

        <div class="ticket-info-group">
          <small>Huésped Titular</small>
          <h3>{{ ticket.cliente }}</h3>
        </div>

        <div class="ticket-info-group">
          <small>Habitación Reservada</small>
          <h3>{{ ticket.habitacion }}</h3>
        </div>

        <div class="ticket-row dates-row">
          <div class="ticket-col">
            <small>Llegada (Check-in)</small>
            <strong>{{ formatearFecha(ticket.llegada) }}</strong>
            <small>15:00 hrs</small>
          </div>
          <div class="ticket-col text-right">
            <small>Salida (Check-out)</small>
            <strong>{{ formatearFecha(ticket.salida) }}</strong>
            <small>12:00 hrs</small>
          </div>
        </div>

        <hr class="divider">

        <div class="ticket-row total-row">
          <div class="ticket-col">
            <small>Método de Pago</small>
            <strong>{{ formatearMetodo(ticket.metodo) }}</strong>
          </div>
          <div class="ticket-col text-right">
            <small>Total Pagado</small>
            <strong class="price">{{ formatearMoneda(ticket.total) }}</strong>
          </div>
        </div>
      </div>

      <div class="ticket-footer">
        <p>¡Gracias por tu preferencia!</p>
        <small>Presenta este comprobante digital o impreso al llegar al hotel.</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import html2pdf from 'html2pdf.js'; // Importamos la magia

const router = useRouter();
const ticket = ref(null);
const ticketPDF = ref(null); // Referencia al contenedor HTML

onMounted(() => {
  const guardado = localStorage.getItem('ticket_dalam');
  if (guardado) {
    ticket.value = JSON.parse(guardado);
  } else {
    // Si entra a esta URL sin haber comprado, lo pateamos al inicio
    router.push('/');
  }
});

const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(fecha);
};

const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
};

const formatearMetodo = (metodo) => {
  const metodos = {
    'tarjeta': 'Tarjeta Crédito/Débito',
    'mercadopago': 'Mercado Pago',
    'hotel': 'Pago en Lobby'
  };
  return metodos[metodo] || 'No especificado';
};

const descargarPDF = () => {
  const elemento = ticketPDF.value;
  const opciones = {
    margin:       10,
    filename:     `Reserva_QuintaDalam_${ticket.value.folio}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opciones).from(elemento).save();
};
</script>

<style scoped>
.ticket-wrapper {
  max-width: 600px;
  margin: 40px auto 80px;
  padding: 0 20px;
}

.actions-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.btn-outline {
  padding: 10px 20px;
  border: 1.5px solid #082B59;
  color: #082B59;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
}

.btn-primary {
  padding: 10px 20px;
  background: #A62679;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

/* Diseño del Recibo */
.ticket-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  border: 1px solid #eaeaea;
  padding: 40px;
  color: #333;
}

.ticket-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-placeholder {
  font-size: 3rem;
  margin-bottom: 10px;
}

.ticket-header h2 {
  font-family: 'Bodoni Moda SC', serif;
  color: #082B59;
  margin: 0 0 5px 0;
  font-size: 2rem;
}

.ticket-header p {
  margin: 0;
  color: #A62679;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.85rem;
  font-weight: bold;
}

.ticket-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.ticket-col {
  display: flex;
  flex-direction: column;
}

.text-right {
  text-align: right;
}

.ticket-body small {
  color: #666;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.ticket-body strong {
  color: #082B59;
  font-size: 1.1rem;
}

.ticket-info-group {
  margin-bottom: 20px;
}

.ticket-info-group h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.divider {
  border: none;
  border-top: 2px dashed #eaeaea;
  margin: 25px 0;
}

.dates-row {
  background: #f4f7fb;
  padding: 15px;
  border-radius: 8px;
}

.total-row {
  align-items: center;
}

.price {
  font-size: 1.8rem !important;
  color: #A62679 !important;
}

.ticket-footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.ticket-footer p {
  font-weight: bold;
  color: #082B59;
  margin: 0 0 5px 0;
}

.ticket-footer small {
  color: #888;
}
</style>