<script setup>
import {onMounted, onUnmounted} from 'vue'

// Declaramos la variable del swiper
let mySwiper = null;

onMounted(() => {
  // Inicializamos Swiper usando el objeto global (window.Swiper)
  mySwiper = new window.Swiper(".swiper-container", {
    direction: "vertical",
    loop: true,
    pagination: ".swiper-pagination",
    grabCursor: true,
    speed: 1000,
    paginationClickable: true,
    parallax: true,
    autoplay: false,
    effect: "slide",
    mousewheelControl: 1
  });


  const hint = document.querySelector('.scroll-hint');

  mySwiper.on('slideChangeStart', function () {
    if (hint) {
      hint.style.opacity = '0';
      setTimeout(function () {
        hint.style.display = 'none';
      }, 600);
    }
  });
})

onUnmounted(() => {
  if (mySwiper) {
    mySwiper.destroy(true, true);
  }
})
</script>

<template>


  <div id="conocenos-slider">
    <div class="swiper-container">
      <div class="swiper-wrapper">

        <div class="swiper-slide">
          <div class="slide-image">
            <div class="slide-image-inner img-mision"></div>
            <div class="slide-number">01</div>
          </div>
          <div class="slide-content">
            <span class="slide-tag">Quinta Dalam · Quiénes somos</span>
            <h2 class="slide-title">Nuestra<br><em>Misión</em></h2>
            <div class="slide-divider"></div>
            <p class="slide-text">
              Brindar a nuestros huéspedes una experiencia de descanso auténtica, rodeada de naturaleza
              y calidez humana. Cada detalle de Quinta Dalam está pensado para que cada momento
              se convierta en un recuerdo que valga la pena guardar.
            </p>
            <div class="slide-meta">
              <div class="slide-meta-item">
                <span class="slide-meta-value">12+</span>
                <span class="slide-meta-label">Años de experiencia</span>
              </div>
              <div class="slide-meta-item">
                <span class="slide-meta-value">500+</span>
                <span class="slide-meta-label">Familias recibidas</span>
              </div>
            </div>
          </div>
        </div>

        <div class="swiper-slide">
          <div class="slide-image">
            <div class="slide-image-inner img-vision"></div>
            <div class="slide-number">02</div>
          </div>
          <div class="slide-content">
            <span class="slide-tag">Quinta Dalam · Hacia el futuro</span>
            <h2 class="slide-title">Nuestra<br><em>Visión</em></h2>
            <div class="slide-divider"></div>
            <p class="slide-text">
              Ser reconocidos como el destino de hospitalidad boutique más querido de la región,
              donde la tranquilidad, el lujo accesible y el contacto con la naturaleza se fusionan
              para crear experiencias únicas e irrepetibles.
            </p>
            <div class="slide-meta">
              <div class="slide-meta-item">
                <span class="slide-meta-value">100%</span>
                <span class="slide-meta-label">Compromiso</span>
              </div>
              <div class="slide-meta-item">
                <span class="slide-meta-value">∞</span>
                <span class="slide-meta-label">Aspiraciones</span>
              </div>
            </div>
          </div>
        </div>

        <div class="swiper-slide">
          <div class="slide-image">
            <div class="slide-image-inner img-valores"></div>
            <div class="slide-number">03</div>
          </div>
          <div class="slide-content">
            <span class="slide-tag">Quinta Dalam · Lo que nos mueve</span>
            <h2 class="slide-title">Nuestros<br><em>Valores</em></h2>
            <div class="slide-divider"></div>
            <p class="slide-text">
              Hospitalidad genuina, respeto por el entorno natural, atención al detalle y
              el compromiso de hacer sentir a cada huésped como en casa.
              Estos principios guían cada decisión que tomamos día a día.
            </p>
            <div class="slide-meta">
              <div class="slide-meta-item">
                <span class="slide-meta-value">♥</span>
                <span class="slide-meta-label">Con pasión</span>
              </div>
              <div class="slide-meta-item">
                <span class="slide-meta-value">★</span>
                <span class="slide-meta-label">Con excelencia</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>

  <div class="scroll-hint">
    <span>Scroll</span>
    <svg fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </div>

  <footer class="footer-slider">
    <p class="footer-brand">QUINTA DALAM</p>
    <div class="footer-center">
      <p>Devweb &copy; 2026</p>
    </div>
    <a href="https://jigsaw.w3.org/css-validator/check/referer" target="_blank">
      <img alt="¡CSS Válido!"
           src="https://jigsaw.w3.org/css-validator/images/vcss"
           style="border:0;width:66px;height:23px"/>
    </a>
  </footer>

</template>

<style scoped>

</style>