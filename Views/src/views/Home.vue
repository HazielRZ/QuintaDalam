<script setup>
import {useRouter} from 'vue-router'
import {ref} from 'vue'

const router = useRouter()

const checkin = ref('')
const checkout = ref('')
const huespedes = ref('2')

const buscarDisponibilidad = () => {
  if (new Date(checkout.value) <= new Date(checkin.value)) {
    alert("La fecha de salida debe ser posterior a la de llegada.");
    return;
  }
  router.push({
    path: '/habitaciones',
    query: {
      llegada: checkin.value,
      salida: checkout.value,
      pax: huespedes.value
    }
  })
}

const secciones = [
  {
    titulo: 'Habitaciones',
    descripcion: 'Espacios diseñados para tu máximo confort y descanso, con vistas únicas al paisaje michoacano.',
    icono: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    ruta: '/habitaciones'
  },
  {
    titulo: 'Reservar',
    descripcion: 'Asegura tu lugar en Quinta Dalam. Proceso rápido, seguro y al mejor precio garantizado.',
    icono: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    ruta: '/reservar'
  },
  {
    titulo: 'Contacto',
    descripcion: 'Estamos disponibles para resolver tus dudas y brindarte la mejor atención personalizada.',
    icono: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    ruta: '/contacto'
  },
  {
    titulo: 'Conócenos',
    descripcion: 'Descubre la historia de Quinta Dalam y nuestra pasión por Quencio, Michoacán.',
    icono: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    ruta: '/conocenos'
  },
  {
    titulo: 'Galería',
    descripcion: 'Explora nuestros espacios, jardines y habitaciones a través de nuestras fotografías.',
    icono: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    ruta: '/galeria'
  }
]
</script>

<template>

  <!-- HERO PANTALLA COMPLETA -->
  <div class="hero-wrapper">
    <div class="hero-bg"></div>
    <div class="hero-overlay"></div>

    <div class="hero-content">
      <span class="hero-tag">Quencio, Michoacán</span>
      <h1 class="hero-title">QUINTA DALAM</h1>
      <p class="hero-sub">ESPÍRITU DE MICHOACÁN</p>
      <div class="hero-divider"></div>
      <p class="hero-desc">
        Un refugio de lujo en el corazón de un pueblo mágico.<br>
        Naturaleza, confort y cultura en un solo lugar.
      </p>
      <RouterLink class="btn-hero" to="/habitaciones">Ver habitaciones</RouterLink>
    </div>

    <!-- BARRA DE RESERVA FLOTANTE -->
    <div class="booking-bar">
      <form class="booking-form" @submit.prevent="buscarDisponibilidad">
        <div class="input-group">
          <label for="pas">Huéspedes</label>
          <select id="pas" v-model="huespedes">
            <option value="1">1 habitación, 1 persona</option>
            <option value="2">1 habitación, 2 personas</option>
            <option value="3">1 habitación, 3 personas</option>
            <option value="4">1 habitacion, 4 personas</option>
          </select>
        </div>
        <div class="input-group">
          <label>Llegada - Salida</label>
          <div class="date-inputs">
            <input v-model="checkin" name="checkin" required type="date">
            <input v-model="checkout" name="checkout" required type="date">
          </div>
        </div>
        <button class="btn-check" type="submit">Ver disponibilidad</button>
      </form>
    </div>
  </div>

  <!-- MAIN CONTENIDO -->
  <main class="home-main">

    <!-- ABOUT -->
    <section class="about-section">
      <div class="about-inner">
        <div class="about-text">
          <span class="section-tag">Quiénes somos</span>
          <h2 class="section-titulo">Descubre Quencio</h2>
          <p class="section-sub">Un pueblo mágico escondido en Michoacán</p>
          <p class="about-desc">
            Somos un hotel ubicado en Quencio, Michoacán. Un destino que combina la calidez de la cultura local con el
            confort de espacios únicos diseñados para tu descanso. Cada rincón de Quinta Dalam cuenta una historia.
          </p>
          <RouterLink class="btn-magenta" to="/conocenos">Conoce más</RouterLink>
        </div>
        <div class="about-stats">
          <div class="stat-card">
            <span class="stat-num">10+</span>
            <span class="stat-label">Años de experiencia</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">500+</span>
            <span class="stat-label">Huéspedes felices</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">100%</span>
            <span class="stat-label">Atención personalizada</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">4.9★</span>
            <span class="stat-label">Calificación promedio</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIONES / NAVEGACIÓN VISUAL -->
    <section class="secciones-section">
      <div class="secciones-header">
        <span class="section-tag">Explora</span>
        <h2 class="section-titulo">Todo lo que ofrecemos</h2>
      </div>
      <div class="secciones-grid">
        <RouterLink
            v-for="(sec, i) in secciones"
            :key="i"
            :to="sec.ruta"
            class="seccion-card"
        >
          <div class="seccion-icon" v-html="sec.icono"></div>
          <h3 class="seccion-titulo">{{ sec.titulo }}</h3>
          <p class="seccion-desc">{{ sec.descripcion }}</p>
          <span class="seccion-link">Ir a {{ sec.titulo }} →</span>
        </RouterLink>
      </div>
    </section>

    <!-- RESERVA HOY -->
    <section class="reserva-section">
      <div class="reserva-inner">
        <div class="reserva-text">
          <span class="section-tag light">Reserva hoy</span>
          <h2 class="reserva-titulo">Tu estancia perfecta te espera</h2>
          <ul class="reserva-lista">
            <li>Mejor precio garantizado en nuestra web oficial</li>
            <li>Cancelación flexible según disponibilidad</li>
            <li>Atención personalizada desde tu reserva</li>
          </ul>
          <RouterLink class="btn-blanco" to="/reservar">Reservar ahora</RouterLink>
        </div>
        <div class="reserva-features">
          <div class="feature-pill">
            <svg fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                 stroke-width="2.5" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Reservaciones directas
          </div>
          <div class="feature-pill">
            <svg fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                 stroke-width="2.5" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Amenidades incluidas
          </div>
          <div class="feature-pill">
            <svg fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                 stroke-width="2.5" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Ubicación privilegiada
          </div>
          <div class="feature-pill">
            <svg fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                 stroke-width="2.5" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Gastronomía local
          </div>
        </div>
      </div>
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

/* ── HERO ── */
.hero-wrapper {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(8, 43, 89, 0.55), rgba(8, 43, 89, 0.7)), url('/src/images/head.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 20% 60%, rgba(242, 107, 206, 0.12) 0%, transparent 55%);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 24px;
  animation: fadeUp 1s ease forwards;
  opacity: 0;
  transform: translateY(24px);
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-tag {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #B87270;
  border: 1px solid rgba(184, 114, 112, 0.5);
  padding: 5px 16px;
  border-radius: 3px;
  margin-bottom: 20px;
}

.hero-title {
  font-family: 'Bodoni Moda SC', serif;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 400;
  color: #fff;
  margin: 0 0 10px;
  letter-spacing: 6px;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
}

.hero-sub {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 24px;
}

.hero-divider {
  width: 60px;
  height: 1px;
  background: linear-gradient(to right, transparent, #B87270, transparent);
  margin: 0 auto 24px;
}

.hero-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin: 0 0 36px;
  font-weight: 300;
}

.btn-hero {
  display: inline-block;
  background: #F26BCE;
  color: #fff;
  text-decoration: none;
  padding: 14px 40px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: background 0.3s, transform 0.2s;
}

.btn-hero:hover {
  background: #A62679;
  transform: translateY(-2px);
}

/* ── BOOKING BAR ── */
.booking-bar {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(50%);
  width: 90%;
  max-width: 860px;
  background: #fff;
  border-radius: 10px;
  padding: 20px 28px;
  box-shadow: 0 15px 40px rgba(8, 43, 89, 0.18);
  z-index: 10;
}

.booking-form {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr;
  gap: 0;
  align-items: end;
}

.input-group {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e8e8e8;
  padding: 0 20px;
}

.input-group:first-child {
  padding-left: 0;
}

.input-group:last-of-type {
  border-right: none;
}

.input-group label {
  font-size: 0.68rem;
  font-weight: 700;
  color: #343C49;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.input-group select,
.input-group input {
  border: none;
  font-size: 0.88rem;
  color: #343C49;
  outline: none;
  padding: 4px 0;
  background: transparent;
  font-family: 'Nunito Sans', sans-serif;
}

.date-inputs {
  display: flex;
  gap: 8px;
}

.btn-check {
  background: #F26BCE;
  color: #fff;
  border: none;
  padding: 14px 24px;
  border-radius: 7px;
  font-weight: 700;
  font-size: 0.82rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.3s;
  font-family: 'Nunito Sans', sans-serif;
  white-space: nowrap;
  margin-left: 20px;
}

.btn-check:hover {
  background: #A62679;
}

/* ── MAIN ── */
.home-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 100px 20px 40px;
}

/* ABOUT */
.about-section {
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  margin-bottom: 28px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.about-inner {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 48px;
  align-items: center;
}

.section-tag {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #B87270;
  margin-bottom: 10px;
}

.section-tag.light {
  color: rgba(255, 255, 255, 0.65);
}

.section-titulo {
  font-family: 'Bodoni Moda SC', serif;
  font-size: 2rem;
  font-weight: 400;
  color: #343C49;
  margin: 0 0 6px;
  letter-spacing: 1px;
}

.section-sub {
  font-size: 0.95rem;
  color: #A62679;
  margin: 0 0 18px;
}

.about-desc {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.8;
  margin: 0 0 28px;
  font-weight: 300;
}

.btn-magenta {
  display: inline-block;
  background: #A62679;
  color: #fff;
  text-decoration: none;
  padding: 11px 28px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: background 0.3s;
}

.btn-magenta:hover {
  background: #082B59;
}

.about-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-card {
  background: #f4f7fb;
  border-radius: 10px;
  padding: 22px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: transform 0.25s;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-num {
  font-family: 'Bodoni Moda SC', serif;
  font-size: 2rem;
  color: #A62679;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #777;
  letter-spacing: 0.5px;
}

/* SECCIONES */
.secciones-section {
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  margin-bottom: 28px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.secciones-header {
  text-align: center;
  margin-bottom: 36px;
}

.secciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

.seccion-card {
  display: flex;
  flex-direction: column;
  background: #f4f7fb;
  border-radius: 12px;
  padding: 28px 20px;
  text-decoration: none;
  border: 2px solid transparent;
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

.seccion-card:hover {
  border-color: #F26BCE;
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(166, 38, 121, 0.12);
}

.seccion-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: rgba(242, 107, 206, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A62679;
  margin-bottom: 14px;
  transition: background 0.3s;
}

.seccion-card:hover .seccion-icon {
  background: rgba(166, 38, 121, 0.18);
}

.seccion-titulo {
  font-family: 'Bodoni Moda SC', serif;
  font-size: 1.05rem;
  font-weight: 400;
  color: #082B59;
  margin: 0 0 8px;
}

.seccion-desc {
  font-size: 0.8rem;
  color: #777;
  line-height: 1.6;
  margin: 0 0 14px;
  font-weight: 300;
  flex: 1;
}

.seccion-link {
  font-size: 0.78rem;
  font-weight: 700;
  color: #A62679;
}

.seccion-card:hover .seccion-link {
  color: #F26BCE;
}

/* RESERVA */
.reserva-section {
  background: linear-gradient(135deg, #082B59 0%, #A62679 100%);
  border-radius: 12px;
  padding: 56px 40px;
  margin-bottom: 28px;
}

.reserva-inner {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 48px;
  align-items: center;
}

.reserva-titulo {
  font-family: 'Bodoni Moda SC', serif;
  font-size: 2rem;
  font-weight: 400;
  color: #fff;
  margin: 0 0 24px;
  letter-spacing: 1px;
}

.reserva-lista {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
}

.reserva-lista li {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.8);
  padding: 8px 0 8px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  font-weight: 300;
}

.reserva-lista li::before {
  content: '—';
  color: #F26BCE;
  position: absolute;
  left: 0;
}

.btn-blanco {
  display: inline-block;
  background: #fff;
  color: #A62679;
  text-decoration: none;
  padding: 13px 32px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: background 0.3s, color 0.3s;
}

.btn-blanco:hover {
  background: #F26BCE;
  color: #fff;
}

.reserva-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 14px 18px;
  color: #fff;
  font-size: 0.88rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.feature-pill svg {
  color: #F26BCE;
  flex-shrink: 0;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .booking-form {
    grid-template-columns: 1fr;
  }

  .input-group {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
  }

  .btn-check {
    margin-left: 0;
    margin-top: 8px;
  }

  .about-inner, .reserva-inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .home-main {
    padding: 80px 16px 40px;
  }

  .about-section, .secciones-section, .reserva-section {
    padding: 32px 20px;
  }

  .secciones-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .secciones-grid {
    grid-template-columns: 1fr;
  }
}
</style>