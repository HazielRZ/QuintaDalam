<script setup>
import {computed, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router'; // Importamos useRoute

const router = useRouter();
const route = useRoute();
const habitaciones = ref([]);
const cargando = ref(true);
const errorConexion = ref(false);

onMounted(async () => {
  try {

    const {llegada, salida, pax} = route.query;

    let url = 'http://localhost:3000/api/habitaciones';

    if (llegada && salida) {
      url = `http://localhost:3000/api/disponibilidad?llegada=${llegada}&salida=${salida}&pax=${pax}`;
    }

    const respuesta = await fetch(url);

    if (!respuesta.ok) throw new Error('Error al obtener datos');

    const datos = await respuesta.json();
    habitaciones.value = datos.map(hab => ({
      ...hab,
      precioBase: parseFloat(hab.precio_base)
    }));

  } catch (error) {
    console.error(error);
    errorConexion.value = true;
  } finally {
    cargando.value = false;
  }
});

// SOLO las habitaciones disponibles
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
    <div v-if="cargando" style="text-align: center; padding: 40px; color: #A62679;">
      <h3>Cargando habitaciones... ⏳</h3>
    </div>

    <div v-else-if="errorConexion" style="text-align: center; padding: 40px; color: red;">
      <h3>Ups, no pudimos conectar con el servidor. 🔌</h3>
      <p>Asegúrate de que el backend esté corriendo en el puerto 3000.</p>
    </div>


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

          <p class="room-desc">{{ habitacion.descripcion }}</p>

          <ul class="room-amenities">
            <li v-for="(amenidad, i) in habitacion.amenidades" :key="i">{{ amenidad }}</li>
          </ul>

          <div class="room-action">
            <span class="room-price">${{
                habitacion.precioBase?.toLocaleString('es-MX')
              }} MXN <span>/ noche</span></span>
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
.room-card {
  display: flex;
  align-items: stretch;
}


.room-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}


.room-desc {
  display: -webkit-box;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0;
}

.room-action {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #eaeaea;
}
</style>