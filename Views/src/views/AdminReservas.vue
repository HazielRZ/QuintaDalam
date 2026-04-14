<template>
  <div class="admin-reservas-wrapper">
    <header class="lobby-header">
      <div class="header-content">
        <span class="section-tag">Panel de Control</span>
        <h1 class="hero-title-admin">Reservaciones</h1>
        <p class="hero-desc-admin">Historial de llegadas y detalles de huéspedes</p>
      </div>
      <div class="header-actions">
        <RouterLink class="btn-outline" to="/admin">← Volver al Lobby</RouterLink>
      </div>
    </header>

    <main class="table-container">
      <div v-if="cargando" class="loading-state">
        <span class="spinner">⏳</span> Cargando información...
      </div>

      <div v-else-if="reservas.length === 0" class="empty-state">
        <span class="empty-icon">📂</span>
        <h3>Bandeja Vacía</h3>
        <p>Aún no hay reservaciones registradas en el sistema.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="modern-table">
          <thead>
          <tr>
            <th>Folio</th>
            <th>Huésped</th>
            <th>Contacto</th>
            <th>Habitación</th>
            <th>Llegada / Salida</th>
            <th class="text-right">Total Pagado</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="reserva in reservas" :key="reserva.id">
            <td class="td-folio">
              <span class="folio-badge">#{{ String(reserva.id).padStart(4, '0') }}</span>
            </td>
            <td>
              <div class="guest-name">{{ reserva.nombre_cliente }} {{ reserva.apellidos }}</div>
            </td>
            <td>
              <div class="contact-info">
                <span class="contact-email">✉️ {{ reserva.email }}</span>
                <span class="contact-phone">📞 {{ reserva.telefono }}</span>
              </div>
            </td>
            <td>
              <div class="room-info">
                <span class="room-name">{{ reserva.habitacion_nombre }}</span>
                <span class="room-type">{{ reserva.habitacion_tipo }}</span>
              </div>
            </td>
            <td>
              <div class="date-info">
                <strong>Entrada:</strong> {{ formatearFecha(reserva.fecha_entrada) }}<br>
                <strong>Salida:</strong> {{ formatearFecha(reserva.fecha_salida) }}
              </div>
            </td>
            <td class="td-total text-right">
              {{ formatearMoneda(reserva.total) }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();
const reservas = ref([]);
const cargando = ref(true);

const cargarReservas = async () => {
  const token = localStorage.getItem('token_dalam');
  try {
    const respuesta = await fetch('http://localhost:3000/api/reservas', {
      headers: {'Authorization': `Bearer ${token}`}
    });

    if (respuesta.ok) {
      reservas.value = await respuesta.json();
    } else {
      if (respuesta.status === 401 || respuesta.status === 403) {
        localStorage.removeItem('token_dalam');
        router.push('/login');
      }
    }
  } catch (error) {
    console.error('Error al conectar:', error);
  } finally {
    cargando.value = false;
  }
};

const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
  return new Intl.DateTimeFormat('es-MX', {day: '2-digit', month: 'short', year: 'numeric'}).format(fecha);
};

const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(valor);
};

onMounted(cargarReservas);
</script>

<style scoped>


.section-tag {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #B87270;
  margin-bottom: 10px;
}



.btn-outline {
  display: inline-block;
  padding: 10px 20px;
  border: 1.5px solid #082B59;
  color: #082B59;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-outline:hover {
  background: #082B59;
  color: #fff;
}

.table-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid #eaeaea;
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}


.modern-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  white-space: nowrap;
}

.modern-table th {
  background-color: #f4f7fb;
  color: #082B59;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 18px 25px;
  border-bottom: 2px solid #eaeaea;
}

.modern-table td {
  padding: 18px 25px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.modern-table tbody tr {
  transition: background-color 0.2s ease;
}

.modern-table tbody tr:hover {
  background-color: #fafbfc;
}

.folio-badge {
  background: rgba(166, 38, 121, 0.1);
  color: #A62679;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85rem;
}

.guest-name {
  font-weight: 700;
  color: #333;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
  color: #666;
}

.room-info {
  display: flex;
  flex-direction: column;
}

.room-name {
  font-weight: 700;
  color: #082B59;
}

.room-type {
  font-size: 0.8rem;
  color: #A62679;
}

.date-info {
  font-size: 0.85rem;
  color: #555;
  line-height: 1.5;
}

.td-total {
  font-weight: 700;
  color: #27ae60;
  font-size: 1.05rem;
}

.text-right {
  text-align: right;
}


.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 15px;
}

.empty-state h3 {
  color: #082B59;
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .lobby-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>