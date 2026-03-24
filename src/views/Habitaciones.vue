<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';

import habitacionesData from '../Json/habitaciones.json';

const router = useRouter();
const habitaciones = ref(habitacionesData);

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
    <RouterLink to="/Alta" class="btn-services" style="margin-left: 15px;">
      Agregar Nueva Habitacion
    </RouterLink>
    <div class="room-list">
      <article
          v-for="(habitacion, index) in habitaciones"
          :key="habitacion.id"
          :class="{ 'reverse': index % 2 !== 0 }"
          class="room-card"
      >
        <div class="room-image">
          <img :alt="`${habitacion.nombre} Quinta Dalam`" :src="habitacion.imagenes[0]">
        </div>
        <div class="room-info">
          <h3>{{ habitacion.nombre }}</h3>
          <p>{{ habitacion.descripcion }}</p>

          <ul class="room-amenities">
            <li v-for="(amenidad, i) in habitacion.amenidades" :key="i">{{ amenidad }}</li>
          </ul>

          <div class="room-action">
            <span class="room-price">${{ habitacion.precioBase }} MXN <span>/ noche</span></span>
            <button class="btn-check" @click="prepararReserva(habitacion.id)">
              Consultar
            </button>
          </div>
        </div>
      </article>

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

</style>