<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import habitacionesData from '../Json/habitaciones.json';

const router = useRouter();
const habitaciones = ref([]);


const STORAGE_KEY = 'catalogoHabitaciones';

onMounted(() => {
  const guardadas = localStorage.getItem(STORAGE_KEY);

  if (guardadas && guardadas !== '[]') {
    habitaciones.value = JSON.parse(guardadas);
  } else {
    // Si no hay datos, inicializamos con el JSON
    habitaciones.value = [...habitacionesData];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habitaciones.value));
  }
});

//  Filtramos para mostrar al público SOLO las habitaciones disponibles
const habitacionesDisponibles = computed(() => {
  return habitaciones.value.filter(hab => hab.disponible === true);
});

const prepararReserva = (idHabitacion) => {
  localStorage.setItem('habitacionSeleccionada', idHabitacion);
  router.push('/reservar');
};
</script>

<template>
  <header>
    <h1>HABITACIONES</h1>
  </header>

  <main class="habitaciones-main">
    <h2 id="TituloHabitaciones">Nuestras Opciones de Descanso</h2>
    <p style="text-align: center; color: #555; margin-bottom: 40px;">
      Encuentra el espacio perfecto para tu estadía. Diseñadas para tu máximo confort.
    </p>

    <div class="room-list">
      <article
          v-for="(habitacion, index) in habitacionesDisponibles"
          :key="habitacion.id"
          :class="{ 'reverse': index % 2 !== 0 }"
          class="room-card"
      >
        <div class="room-image">
          <img :alt="`${habitacion.nombre} Quinta Dalam`"
               :src="habitacion.imagenes && habitacion.imagenes.length ? habitacion.imagenes[0] : '/src/images/hotel.webp'">
        </div>
        <div class="room-info">

          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <h3>{{ habitacion.nombre }}</h3>
            <span style="font-size: 0.9rem; color: #A62679; font-weight: bold;">
              Capacidad: {{ habitacion.capacidad }} pax
            </span>
          </div>
          <p style="font-weight: 600; margin-top: -10px; margin-bottom: 10px; color: #555;">
            {{ habitacion.tipo }}
          </p>

          <p>{{ habitacion.descripcion }}</p>

          <ul class="room-amenities">
            <li v-for="(amenidad, i) in habitacion.amenidades" :key="i">{{ amenidad }}</li>
          </ul>

          <div class="room-action">
            <span class="room-price">${{ habitacion.precioBase?.toLocaleString('es-MX') }} MXN <span>/ noche</span></span>
            <button class="btn-check" @click="prepararReserva(habitacion.id)">
              Consultar
            </button>
          </div>
        </div>
      </article>

      <div v-if="habitacionesDisponibles.length === 0" style="text-align: center; width: 100%; padding: 40px;">
        <p>Por el momento no tenemos habitaciones disponibles. ¡Vuelve pronto!</p>
      </div>
    </div>
  </main>

  <footer>
    <p>QUINTA DALAM</p>
    <div class="sidebar-footer">
      <p>Devweb &copy; 2026</p>
    </div>
    <p>
      <a href="https://jigsaw.w3.org/css-validator/check/referer" target="_blank">
        <img alt="¡CSS Válido!"
             src="https://jigsaw.w3.org/css-validator/images/vcss"
             style="border:0;width:88px;height:31px"/>
      </a>
    </p>
  </footer>
</template>

<style scoped>
/* Tus estilos previos se mantienen intactos */
</style>