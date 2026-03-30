<template>
  <div class="admin-lobby">
    <header class="lobby-header">
      <div class="header-content">
        <span class="section-tag">Panel de Control</span>
        <h1 class="hero-title-admin">Centro de Mando</h1>
        <p class="hero-desc-admin">Bienvenido a la administración de Quinta Dalam</p>
      </div>
      <button class="btn-outline-danger" @click="cerrarSesion">
        <span style="margin-right: 5px;">🚪</span> Cerrar Sesión
      </button>
    </header>

    <main class="lobby-grid">
      <div class="lobby-card">
        <div class="card-icon-wrapper">
          <span class="card-icon">🛏️</span>
        </div>
        <h3 class="card-title">Catálogo de Habitaciones</h3>
        <p class="card-desc">Administra el inventario del hotel. Agrega nuevas habitaciones, edita detalles, ajusta
          capacidades y precios por noche.</p>
        <div class="card-action">
          <RouterLink class="btn-magenta" to="/alta">Gestionar Catálogo</RouterLink>
        </div>
      </div>

      <div class="lobby-card">
        <div class="card-icon-wrapper">
          <span class="card-icon">📅</span>
        </div>
        <h3 class="card-title">Control de Reservas</h3>
        <p class="card-desc">Visualiza el historial completo de compras. Consulta los datos de los huéspedes, fechas de
          llegada y montos pagados.</p>
        <div class="card-action">
          <RouterLink class="btn-magenta secondary" to="/admin/reservas">Ver Reservaciones</RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';

const router = useRouter();

const cerrarSesion = () => {
  localStorage.removeItem('token_dalam');
  router.push('/login');
};
</script>

<style scoped>
.admin-lobby {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 20px;
}


.lobby-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 50px;
  padding-bottom: 25px;
  border-bottom: 1px solid #eaeaea;
}

.section-tag {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #B87270;
  margin-bottom: 10px;
}

.hero-title-admin {
  font-family: 'Bodoni Moda SC', serif;
  font-size: 2.5rem;
  color: #f27272;
  margin: 0 0 5px 0;
}

.hero-desc-admin {
  font-size: 0.95rem;
  color: #555;
  margin: 0;
}


.btn-outline-danger {
  background: transparent;
  color: #d32f2f;
  border: 1px solid #d32f2f;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline-danger:hover {
  background: #d32f2f;
  color: white;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.2);
}


.lobby-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.lobby-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.lobby-card:hover {
  border-color: #F26BCE;
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(166, 38, 121, 0.1);
}

.card-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: rgba(242, 107, 206, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  transition: background 0.3s;
}

.lobby-card:hover .card-icon-wrapper {
  background: rgba(166, 38, 121, 0.15);
}

.card-icon {
  font-size: 1.8rem;
}

.card-title {
  font-family: 'Bodoni Moda SC', serif;
  font-size: 1.5rem;
  color: #082B59;
  margin: 0 0 15px 0;
}

.card-desc {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.7;
  flex-grow: 1;
  margin: 0 0 30px 0;
}

.btn-magenta {
  display: block;
  text-align: center;
  background: #A62679;
  color: #fff;
  text-decoration: none;
  padding: 14px 28px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: background 0.3s, transform 0.2s;
}

.btn-magenta:hover {
  background: #082B59;
  transform: translateY(-2px);
}

.btn-magenta.secondary {
  background: #082B59;
}

.btn-magenta.secondary:hover {
  background: #A62679;
}

@media (max-width: 768px) {
  .lobby-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>