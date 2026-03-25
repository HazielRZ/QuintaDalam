<template>
  <div class="alta-view">
    <header class="page-header">
      <nav>
        <RouterLink class="btn-back" to="/habitaciones">← Regresar a Habitaciones</RouterLink>
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
            <input id="nombre" v-model="formulario.nombre" placeholder="Ej. Suite Presidencial" required type="text">
          </div>
          <div class="form-group">
            <label for="precio">Precio por Noche (MXN)</label>
            <input id="precio" v-model.number="formulario.precio" min="0" placeholder="Ej. 1500" required type="number">
          </div>
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" v-model="formulario.descripcion" placeholder="Describe las características de la habitación..."
                    required rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="foto">Ruta de la Imagen</label>
          <input id="foto" v-model="formulario.foto" placeholder="img/habitacion.jpg" required type="text">
        </div>
        <div class="form-actions">
          <button v-if="modoEdicion" class="btn-secondary" type="button" @click="cancelarFormulario">
            Cancelar
          </button>
          <button v-else class="btn-secondary" type="button" @click="limpiarFormulario">
            Limpiar
          </button>
          <button class="btn-primary" type="submit">
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
            :class="{ 'card--editing': modoEdicion && indiceEdicion === index }"
            class="card"
        >
          <div class="card-img-wrapper">
            <img :alt="hab.nombre" :src="hab.foto" class="card-img" @error="onImgError($event)">
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
    <div v-if="modalEliminar" class="modal-overlay" @click.self="modalEliminar = false">
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
      <div v-if="toast.visible" :class="`toast--${toast.tipo}`" class="toast">
        {{ toast.mensaje }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {RouterLink} from 'vue-router';

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

const toast = reactive({visible: false, mensaje: '', tipo: 'success'});

const cargarDatos = () => {
  const datos = localStorage.getItem(STORAGE_KEY);
  habitaciones.value = datos ? JSON.parse(datos) : [];
};

const guardarDatos = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habitaciones.value));
};

const procesarFormulario = () => {
  if (modoEdicion.value) {
    habitaciones.value[indiceEdicion.value] = {...formulario};
    mostrarToast('Habitación actualizada correctamente.', 'success');
    cancelarFormulario();
  } else {
    habitaciones.value.push({...formulario});
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
  window.scrollTo({top: 0, behavior: 'smooth'});
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

</style>