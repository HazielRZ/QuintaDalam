<template>
  <div class="alta-view">
    <header class="page-header">
      <nav>
        <RouterLink to="/habitaciones" class="btn-back">← Regresar a Habitaciones</RouterLink>
      </nav>
      <div class="header-content">
        <h1>Gestión de Habitaciones</h1>
        <p class="subtitle">Administra el catálogo de habitaciones disponibles</p>
      </div>
    </header>

    <!-- FORMULARIO: Alta y Edición -->
    <section class="form-container">
      <h2>{{ modoEdicion ? '✏️ Editar Habitación' : '🛏️ Nueva Habitación' }}</h2>
      <form @submit.prevent="procesarFormulario">
        <div class="form-grid">
          <div class="form-group">
            <label for="nombre">Nombre de la Habitación</label>
            <input type="text" id="nombre" v-model="formulario.nombre" placeholder="Ej. Suite Presidencial" required />
          </div>
          <div class="form-group">
            <label for="precio">Precio por Noche (MXN)</label>
            <input type="number" id="precio" v-model.number="formulario.precio" placeholder="Ej. 1500" min="0" required />
          </div>
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" v-model="formulario.descripcion" rows="3" placeholder="Describe las características de la habitación..." required></textarea>
        </div>
        <div class="form-group">
          <label for="foto">Ruta de la Imagen</label>
          <input type="text" id="foto" v-model="formulario.foto" placeholder="img/habitacion.jpg" required />
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="cancelarFormulario" v-if="modoEdicion">
            Cancelar
          </button>
          <button type="button" class="btn-secondary" @click="limpiarFormulario" v-else>
            Limpiar
          </button>
          <button type="submit" class="btn-primary">
            {{ modoEdicion ? 'Guardar Cambios' : 'Registrar Habitación' }}
          </button>
        </div>
      </form>
    </section>

    <!-- LISTA: Lectura -->
    <section class="lista-container">
      <div class="lista-header">
        <h2>📋 Habitaciones Registradas</h2>
        <span class="badge">{{ habitaciones.length }} habitación(es)</span>
      </div>

      <div v-if="habitaciones.length === 0" class="empty-state">
        <span class="empty-icon">🛏️</span>
        <p>No hay habitaciones registradas aún.</p>
        <p class="empty-hint">Usa el formulario de arriba para agregar la primera.</p>
      </div>

      <div v-else class="cards-grid">
        <div
            v-for="(hab, index) in habitaciones"
            :key="index"
            class="card"
            :class="{ 'card--editing': modoEdicion && indiceEdicion === index }"
        >
          <div class="card-img-wrapper">
            <img :src="hab.foto" :alt="hab.nombre" class="card-img" @error="onImgError($event)" />
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ hab.nombre }}</h3>
            <p class="card-desc">{{ hab.descripcion }}</p>
            <p class="card-price">${{ hab.precio?.toLocaleString('es-MX') }} <span>MXN / noche</span></p>
          </div>
          <div class="card-actions">
            <button class="btn-edit" @click="iniciarEdicion(index)">✏️ Editar</button>
            <button class="btn-delete" @click="confirmarEliminar(index)">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal de confirmación -->
    <div class="modal-overlay" v-if="modalEliminar" @click.self="modalEliminar = false">
      <div class="modal">
        <h3>¿Eliminar habitación?</h3>
        <p>Esta acción no se puede deshacer.</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="modalEliminar = false">Cancelar</button>
          <button class="btn-delete-modal" @click="eliminarHabitacion">Sí, eliminar</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div class="toast" v-if="toast.visible" :class="`toast--${toast.tipo}`">
        {{ toast.mensaje }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const STORAGE_KEY = 'catalogoHabitaciones';

const habitaciones = ref([]);
const modoEdicion = ref(false);
const indiceEdicion = ref(null);
const modalEliminar = ref(false);
const indiceAEliminar = ref(null);

const formulario = reactive({
  nombre: '',
  descripcion: '',
  precio: null,
  foto: 'img/avatar.webp',
});

const toast = reactive({ visible: false, mensaje: '', tipo: 'success' });

const cargarDatos = () => {
  const datos = localStorage.getItem(STORAGE_KEY);
  habitaciones.value = datos ? JSON.parse(datos) : [];
};

const guardarDatos = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habitaciones.value));
};

const procesarFormulario = () => {
  if (modoEdicion.value) {
    habitaciones.value[indiceEdicion.value] = { ...formulario };
    mostrarToast('Habitación actualizada correctamente.', 'success');
    cancelarFormulario();
  } else {
    habitaciones.value.push({ ...formulario });
    mostrarToast('Habitación registrada con éxito.', 'success');
    limpiarFormulario();
  }
  guardarDatos();
};

const iniciarEdicion = (index) => {
  const hab = habitaciones.value[index];
  formulario.nombre = hab.nombre;
  formulario.descripcion = hab.descripcion;
  formulario.precio = hab.precio;
  formulario.foto = hab.foto;
  modoEdicion.value = true;
  indiceEdicion.value = index;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelarFormulario = () => {
  modoEdicion.value = false;
  indiceEdicion.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  formulario.nombre = '';
  formulario.descripcion = '';
  formulario.precio = null;
  formulario.foto = 'img/avatar.webp';
};

const confirmarEliminar = (index) => {
  indiceAEliminar.value = index;
  modalEliminar.value = true;
};

const eliminarHabitacion = () => {
  habitaciones.value.splice(indiceAEliminar.value, 1);
  guardarDatos();
  modalEliminar.value = false;
  mostrarToast('Habitación eliminada.', 'error');
};

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.mensaje = mensaje;
  toast.tipo = tipo;
  toast.visible = true;
  setTimeout(() => (toast.visible = false), 3000);
};

const onImgError = (e) => {
  e.target.src = 'img/avatar.webp';
};

onMounted(cargarDatos);
</script>

<style scoped>
/* ── Variables — paleta que hace juego con la app ── */
.alta-view {
  --color-primary: hsla(160, 100%, 37%, 1);   /* verde de la app */
  --color-primary-hover: hsla(160, 100%, 28%, 1);
  --color-primary-light: hsla(160, 100%, 37%, 0.12);
  --color-accent: #c0398a;                     /* magenta/rosa de los títulos */
  --color-accent-hover: #a02e72;
  --color-accent-light: rgba(192, 57, 138, 0.1);
  --color-danger: #c0398a;                     /* usamos el mismo magenta para eliminar */
  --color-danger-light: rgba(192, 57, 138, 0.08);
  --color-success: hsla(160, 100%, 37%, 1);
  --color-text: #2c2c2c;
  --color-muted: #6b6b6b;
  --color-bg: #f0f2f5;
  --color-surface: #ffffff;
  --radius: 12px;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  --shadow-hover: 0 8px 28px rgba(0, 0, 0, 0.12);

  min-height: 100vh;
  background-color: var(--color-bg);
  padding: 0 0 60px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: var(--color-text);
}

/* ── Header ── */
.page-header {
  background: var(--color-surface);
  border-bottom: 2px solid var(--color-primary-light);
  padding: 18px 40px 22px;
}

.btn-back {
  text-decoration: none;
  color: var(--color-primary);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 3px;
  transition: background-color 0.4s;
}
.btn-back:hover {
  background-color: var(--color-primary-light);
}

.header-content { margin-top: 14px; }
.header-content h1 {
  font-size: 1.9rem;
  font-weight: 800;
  margin: 0;
  color: var(--color-accent);          /* título magenta igual que en Habitaciones */
  letter-spacing: -0.5px;
}
.subtitle {
  font-size: 0.95rem;
  color: var(--color-muted);
  margin: 5px 0 0;
}

/* ── Secciones ── */
.form-container,
.lista-container {
  max-width: 900px;
  margin: 30px auto 0;
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 32px;
  border: 1px solid #e8eaed;
}

.form-container h2,
.lista-header h2 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 22px;
  color: var(--color-text);
}

/* ── Formulario ── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.form-group { margin-bottom: 18px; }

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.87rem;
  margin-bottom: 7px;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 13px;
  border: 1px solid #d6d9de;
  border-radius: 7px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #fafafa;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
  color: var(--color-text);
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
  background: #fff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 6px;
}

/* ── Botones ── */
.btn-primary {
  background: var(--color-accent);    /* magenta igual que botón "Consultar" */
  color: white;
  border: none;
  padding: 10px 26px;
  border-radius: 7px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.3s, transform 0.15s;
  letter-spacing: 0.02em;
}
.btn-primary:hover { background: var(--color-accent-hover); }
.btn-primary:active { transform: scale(0.97); }

.btn-secondary {
  background: transparent;
  color: var(--color-muted);
  border: 1px solid #d0d5dd;
  padding: 10px 20px;
  border-radius: 7px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-secondary:hover {
  background: #f0f0f0;
  color: var(--color-text);
}

/* ── Lista header ── */
.lista-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}
.badge {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 3px 11px;
  border-radius: 20px;
  letter-spacing: 0.02em;
}

/* ── Empty state ── */
.empty-state {
  text-align: center;
  padding: 48px 0;
  color: var(--color-muted);
}
.empty-icon { font-size: 3.2rem; display: block; margin-bottom: 14px; }
.empty-hint { font-size: 0.85rem; margin-top: 4px; }

/* ── Cards grid ── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 22px;
}

.card {
  border: 1px solid #e8eaed;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--color-surface);
  transition: box-shadow 0.25s, transform 0.25s;
}
.card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-3px);
}
.card--editing {
  border: 2px solid var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-light);
}

.card-img-wrapper { height: 165px; overflow: hidden; background: #f0f0f0; }
.card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s; }
.card:hover .card-img { transform: scale(1.04); }

.card-body { padding: 15px 18px; }
.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 6px;
  color: var(--color-accent);          /* nombre en magenta igual que en la app */
}
.card-desc {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin: 0 0 12px;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-price {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text);
  margin: 0;
}
.card-price span {
  font-weight: 400;
  font-size: 0.8rem;
  color: var(--color-muted);
}

.card-actions {
  display: flex;
  border-top: 1px solid #f0f0f0;
}
.btn-edit, .btn-delete {
  flex: 1;
  padding: 10px;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  background: transparent;
}
.btn-edit { color: var(--color-primary); border-right: 1px solid #f0f0f0; }
.btn-edit:hover { background: var(--color-primary-light); }
.btn-delete { color: var(--color-accent); }
.btn-delete:hover { background: var(--color-accent-light); }

/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.38);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.modal {
  background: white;
  border-radius: var(--radius);
  padding: 32px;
  max-width: 360px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  text-align: center;
}
.modal h3 { margin: 0 0 8px; font-size: 1.15rem; color: var(--color-text); }
.modal p { color: var(--color-muted); margin: 0 0 22px; font-size: 0.9rem; }
.modal-actions { display: flex; gap: 12px; justify-content: center; }

.btn-delete-modal {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 7px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-delete-modal:hover { background: var(--color-accent-hover); }

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: 26px;
  right: 26px;
  padding: 12px 22px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  z-index: 200;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
.toast--success { background: var(--color-success); }
.toast--error   { background: var(--color-accent); }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }

/* ── Responsive ── */
@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
  .page-header { padding: 14px 20px 18px; }
  .form-container, .lista-container { margin: 16px; padding: 20px; }
  .cards-grid { grid-template-columns: 1fr; }
  .header-content h1 { font-size: 1.5rem; }
}
</style>