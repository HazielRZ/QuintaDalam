<template>
  <div class="alta-view">
    <header class="page-header">
      <nav>
        <RouterLink class="btn-back" to="/habitaciones">← Regresar a Habitaciones</RouterLink>
      </nav>
      <div class="header-content">
        <h1>Gestión de Habitaciones</h1>
        <p class="subtitle">Administra el catálogo de habitaciones disponibles en Quinta Dalam</p>
      </div>
    </header>

    <section class="form-container">
      <h2>{{ modoEdicion ? '✏️ Editar Habitación' : '🛏️ Nueva Habitación' }}</h2>
      <form @submit.prevent="procesarFormulario">
        <div class="form-grid">
          <div class="form-group">
            <label for="nombre">Nombre de la Habitación</label>
            <input id="nombre" v-model="formulario.nombre" placeholder="Ej. Tzintzuntzan" required type="text">
          </div>
          <div class="form-group">
            <label for="tipo">Tipo de Habitación</label>
            <input id="tipo" v-model="formulario.tipo" placeholder="Ej. Master Suite" required type="text">
          </div>
          <div class="form-group">
            <label for="precioBase">Precio Base por Noche (MXN)</label>
            <input id="precioBase" v-model.number="formulario.precioBase" min="0" placeholder="Ej. 2500" required type="number">
          </div>
          <div class="form-group">
            <label for="capacidad">Capacidad (Personas)</label>
            <input id="capacidad" v-model.number="formulario.capacidad" min="1" placeholder="Ej. 2" required type="number">
          </div>
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" v-model="formulario.descripcion" placeholder="Describe la habitación..." required rows="3"></textarea>
        </div>

        <div class="form-group">
          <label for="amenidades">Amenidades (Separadas por coma)</label>
          <textarea id="amenidades" v-model="formulario.amenidadesInput" placeholder="Ej. 1 Cama King Size, Smart TV 55, Aire Acondicionado" required rows="2"></textarea>
        </div>

        <div class="form-group">
          <label for="foto">Ruta de la Imagen Principal</label>
          <input id="foto" v-model="formulario.fotoInput" placeholder="/src/images/Habitacion.jpg" required type="text">
        </div>

        <div class="form-actions">
          <button v-if="modoEdicion" class="btn-secondary" type="button" @click="cancelarFormulario">Cancelar</button>
          <button v-else class="btn-secondary" type="button" @click="limpiarFormulario">Limpiar</button>
          <button class="btn-primary" type="submit">
            {{ modoEdicion ? 'Guardar Cambios' : 'Registrar Habitación' }}
          </button>
        </div>
      </form>
    </section>

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
            :key="hab.id"
            :class="{ 'card--editing': modoEdicion && indiceEdicion === index }"
            class="card"
        >
          <div class="card-img-wrapper">
            <img :alt="hab.nombre" :src="hab.imagenes && hab.imagenes.length ? hab.imagenes[0] : 'img/avatar.webp'" class="card-img" @error="onImgError($event)">
          </div>
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 class="card-title">{{ hab.nombre }}</h3>
              <small>{{ hab.tipo }} (Cap. {{ hab.capacidad }})</small>
            </div>
            <p class="card-desc">{{ hab.descripcion }}</p>
            <p class="card-price">${{ hab.precioBase?.toLocaleString('es-MX') }} <span>MXN / noche</span></p>
          </div>
          <div class="card-actions">
            <button class="btn-edit" @click="iniciarEdicion(index)">✏️ Editar</button>
            <button class="btn-delete" @click="confirmarEliminar(index)">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    </section>

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

    <transition name="toast">
      <div v-if="toast.visible" :class="`toast--${toast.tipo}`" class="toast">
        {{ toast.mensaje }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';

// JSON
import habitacionesJson from '@/Json/habitaciones.json'; // Ajusta la ruta si es necesario

const STORAGE_KEY = 'catalogoHabitaciones';

const habitaciones = ref([]);
const modoEdicion = ref(false);
const indiceEdicion = ref(null);
const modalEliminar = ref(false);
const indiceAEliminar = ref(null);

// El formulario mapea campos temporales para facilitar la edición de arreglos
const formulario = reactive({
  id: '',
  nombre: '',
  tipo: '',
  descripcion: '',
  precioBase: null,
  capacidad: null,
  amenidadesInput: '',
  fotoInput: '',
  disponible: true
});

const toast = reactive({ visible: false, mensaje: '', tipo: 'success' });

const cargarDatos = () => {
  const datos = localStorage.getItem(STORAGE_KEY);
  if (datos && datos !== '[]') {
    habitaciones.value = JSON.parse(datos);
  } else {
    habitaciones.value = [...habitacionesJson];
    guardarDatos();
  }
};

const guardarDatos = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habitaciones.value));
};

const armarObjetoHabitacion = () => {
  return {
    id: formulario.id || Date.now().toString(),
    nombre: formulario.nombre,
    tipo: formulario.tipo,
    descripcion: formulario.descripcion,
    precioBase: formulario.precioBase,
    capacidad: formulario.capacidad,
    amenidades: formulario.amenidadesInput.split(',').map(item => item.trim()).filter(item => item !== ''),
    imagenes: [formulario.fotoInput],
    disponible: formulario.disponible
  };
};

const procesarFormulario = () => {
  const habitacionFinal = armarObjetoHabitacion();

  if (modoEdicion.value) {
    habitaciones.value[indiceEdicion.value] = habitacionFinal;
    mostrarToast('Habitación actualizada correctamente.', 'success');
    cancelarFormulario();
  } else {
    habitaciones.value.push(habitacionFinal);
    mostrarToast('Habitación registrada con éxito.', 'success');
    limpiarFormulario();
  }
  guardarDatos();
};

const iniciarEdicion = (index) => {
  const hab = habitaciones.value[index];
  formulario.id = hab.id;
  formulario.nombre = hab.nombre;
  formulario.tipo = hab.tipo;
  formulario.descripcion = hab.descripcion;
  formulario.precioBase = hab.precioBase;
  formulario.capacidad = hab.capacidad;
  formulario.amenidadesInput = hab.amenidades ? hab.amenidades.join(', ') : '';
  formulario.fotoInput = hab.imagenes && hab.imagenes.length ? hab.imagenes[0] : '';
  formulario.disponible = hab.disponible;

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
  formulario.id = '';
  formulario.nombre = '';
  formulario.tipo = '';
  formulario.descripcion = '';
  formulario.precioBase = null;
  formulario.capacidad = null;
  formulario.amenidadesInput = '';
  formulario.fotoInput = '';
  formulario.disponible = true;
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
  e.target.src = '/src/images/hotel.webp';
};

onMounted(cargarDatos);
</script>

<style scoped>
</style>