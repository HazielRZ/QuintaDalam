<script setup>

</script>

<template>
  <header>
    <h1>HABITACIONES</h1>
  </header>

  <main class="habitaciones-main">
    <h2 id="TituloHabitaciones">Nuestras Opciones de Descanso</h2>
    <p style="text-align: center; color: #555; margin-bottom: 40px;">Encuentra el espacio perfecto para tu estadía.
      Diseñadas para tu máximo confort.</p>

    <div class="room-list">

      <article class="room-card">
        <div class="room-image">
          <img alt="Master Suite Quinta Dalam" src="/src/images/Habitacion.jpg">
        </div>
        <div class="room-info">
          <h3>Master Suite</h3>
          <p>Nuestra habitación más exclusiva. Espaciosa y elegante, ideal para parejas buscando una escapada romántica
            con un toque de lujo.</p>
          <ul class="room-amenities">
            <li>🛏️ 1 Cama King Size</li>
            <li>🛁 Tina de hidromasaje</li>
            <li>📺 Smart TV 55"</li>
            <li>❄️ Aire Acondicionado</li>
          </ul>
          <div class="room-action">
            <span class="room-price">$2,500 MXN <span>/ noche</span></span>
            <a class="btn-reservar" href="/src/components/Checkout.vue">Consultar</a>
          </div>
        </div>
      </article>

      <article class="room-card reverse">
        <div class="room-image">
          <img alt="Junior Suite Quinta Dalam" src="/src/images/Habitacion2.jpg">
        </div>
        <div class="room-info">
          <h3>Junior Suite (1 Recámara)</h3>
          <p>Equilibrio perfecto entre espacio y comodidad. Cuenta con una sala de estar separada para relajarte después
            de un largo día.</p>
          <ul class="room-amenities">
            <li>🛏️ 1 Cama Queen Size</li>
            <li>🛋️ Sala de estar</li>
            <li>☕ Cafetera</li>
            <li>📶 Wi-Fi de alta velocidad</li>
          </ul>
          <div class="room-action">
            <span class="room-price">$1,800 MXN <span>/ noche</span></span>
            <a class="btn-reservar" href="/src/components/Checkout.vue">Consultar</a>
          </div>
        </div>
      </article>

      <article class="room-card">
        <div class="room-image">
          <img alt="Habitación Doble Quinta Dalam" src="/src/images/Habitacion3.jpg">
        </div>
        <div class="room-info">
          <h3>Doble Estándar</h3>
          <p>La opción ideal para viajes con amigos o colegas. Amplia, bien iluminada y con todas las comodidades
            esenciales.</p>
          <ul class="room-amenities">
            <li>🛏️ 2 Camas Matrimoniales</li>
            <li>🚿 Baño privado</li>
            <li>📺 TV por cable</li>
            <li>🔒 Caja fuerte</li>
          </ul>
          <div class="room-action">
            <span class="room-price">$1,500 MXN <span>/ noche</span></span>
            <a class="btn-reservar" href="/src/components/Checkout.vue">Consultar</a>
          </div>
        </div>
      </article>

      <article class="room-card reverse">
        <div class="room-image">
          <img alt="Habitación Sencilla Quinta Dalam" src="/src/images/Habitacion4.jpg">
        </div>
        <div class="room-info">
          <h3>Sencilla Ejecutiva</h3>
          <p>Diseñada pensando en el viajero de negocios o el turista solitario. Acogedora, práctica y con espacio de
            trabajo.</p>
          <ul class="room-amenities">
            <li>🛏️ 1 Cama Matrimonial</li>
            <li>💻 Escritorio de trabajo</li>
            <li>📶 Wi-Fi de alta velocidad</li>
            <li>🚿 Baño privado</li>
          </ul>
          <div class="room-action">
            <span class="room-price">$1,100 MXN <span>/ noche</span></span>
            <a class="btn-reservar" href="/src/components/Checkout.vue">Consultar</a>
          </div>
        </div>
      </article>

      <article class="room-card">
        <div class="room-image">
          <img alt="Suite Familiar Quinta Dalam" src="/src/images/Habitacion5.jpg">
        </div>
        <div class="room-info">
          <h3>Suite Familiar</h3>
          <p>Espacio de sobra para toda la familia. Dos habitaciones conectadas para mantener a todos juntos sin perder
            privacidad.</p>
          <ul class="room-amenities">
            <li>🛏️ 1 Cama King + 2 Individuales</li>
            <li>🍳 Cocineta equipada</li>
            <li>📺 2 Smart TVs</li>
            <li>❄️ Aire Acondicionado</li>
          </ul>
          <div class="room-action">
            <span class="room-price">$3,200 MXN <span>/ noche</span></span>
            <a class="btn-reservar" href="/src/components/Checkout.vue">Consultar</a>
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