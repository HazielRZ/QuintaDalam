<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()

const buscarDisponibilidad = () => {
  router.push('/habitaciones')
}
</script>

<template>


  <header>

    <h1>QUINTA DALAM</h1>
    <p>ESPIRITU DE MICHOACAN</p>
  </header>

  <main>
    <section class="booking-bar">
      <form class="booking-form" @submit.prevent="buscarDisponibilidad">

        <div class="input-group">
          <label for="pas">Huéspedes</label>
          <select id="pas">
            <option value="1">1 habitación, 1 persona</option>
            <option selected value="2">1 habitación, 2 personas</option>
          </select>
        </div>

        <div class="input-group">
          <label>Llegada - Salida</label>
          <div class="date-inputs">
            <input name="checkin" required type="date">
            <input name="checkout" required type="date">
          </div>
        </div>

        <button class="btn-check" type="submit">Ver disponibilidad</button>
      </form>
    </section>
    <section class="hero">
      <div>
        <h1>Descubre Quencio</h1>
        <p>Un pueblo magico escondido en Michoacan</p>
      </div>
    </section>

    <section>
      <h2>About Me</h2>
      <p>Somos un hotel ubicado en Quencio Michoacan </p>
    </section>

    <section>
      <h2>Reserva hoy</h2>
      <ul>
        <li>Lore ipsum</li>
        <li>Lore Ipsum</li>
        <li>Lore Ipsum</li>
      </ul>
      <ul class="features">
        <li>Reservaciones</li>
        <li>Amenidades</li>
        <li>Mapa</li>
      </ul>
    </section>
  </main>

  <footer>
    <p>QUINTA DALAM</p>
    <div class="sidebar-footer">
      <p>Devweb &copy; 2026</p>
    </div>


    <p>
      <a href="https://jigsaw.w3.org/css-validator/check/referer">
        <img alt="¡CSS Válido!"
             src="https://jigsaw.w3.org/css-validator/images/vcss"
             style="border:0;width:88px;height:31px"/>
      </a>
    </p>

  </footer>

</template>

<style scoped>

</style>