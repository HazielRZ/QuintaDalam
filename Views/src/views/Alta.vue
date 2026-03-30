<template>
  <div class="alta-view">
    <header class="page-header">
      <nav>
        <RouterLink class="btn-back" to="/admin">← Volver al Panel</RouterLink>
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
            <input id="precioBase" v-model.number="formulario.precioBase" min="0" placeholder="Ej. 2500" required
                   type="number">
          </div>
          <div class="form-group">
            <label for="capacidad">Capacidad (Personas)</label>
            <input id="capacidad" v-model.number="formulario.capacidad" min="1" placeholder="Ej. 2" required
                   type="number">
          </div>
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" v-model="formulario.descripcion" placeholder="Describe la habitación..." required
                    rows="3"></textarea>
        </div>

        <div class="form-group">
          <label for="amenidades">Amenidades (Separadas por coma)</label>
          <textarea id="amenidades" v-model="formulario.amenidadesInput"
                    placeholder="Ej. 1 Cama King Size, Smart TV 55, Aire Acondicionado" required rows="2"></textarea>
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
            <img :alt="hab.nombre"
                 :src="hab.imagenes && hab.imagenes.length ? hab.imagenes[0] : '/src/images/hotel.webp'"
                 class="card-img" @error="onImgError($event)">
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
import {onMounted, reactive, ref} from 'vue';
import {RouterLink} from 'vue-router'; // Lo volvemos a importar para evitar que WebStorm o Vue se quejen

const API_URL = 'http://localhost:3000/api/habitaciones';

const habitaciones = ref([]);
const modoEdicion = ref(false);
const indiceEdicion = ref(null);
const modalEliminar = ref(false);
const indiceAEliminar = ref(null);

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

const toast = reactive({visible: false, mensaje: '', tipo: 'success'});

// 1. LEER (GET)
const cargarDatos = async () => {
  try {
    const respuesta = await fetch(API_URL);
    const datos = await respuesta.json();
    habitaciones.value = datos.map(hab => ({
      ...hab,
      precioBase: parseFloat(hab.precio_base)
    }));
  } catch (error) {
    mostrarToast('Error al conectar con la base de datos.', 'error');
  }
};
// 2. CREAR O EDITAR (POST / PUT)
const procesarFormulario = async () => {
  const habitacionFinal = {
    nombre: formulario.nombre,
    tipo: formulario.tipo,
    descripcion: formulario.descripcion,
    precio_base: formulario.precioBase,
    capacidad: formulario.capacidad,
    amenidades: formulario.amenidadesInput.split(',').map(item => item.trim()).filter(item => item !== ''),
    imagenes: [formulario.fotoInput],
    disponible: formulario.disponible
  };

  // 🔑 Recuperamos el token de seguridad del administrador
  const token = localStorage.getItem('token_dalam');

  try {
    if (modoEdicion.value) {
      await fetch(`${API_URL}/${formulario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 🛡️ Pase VIP para editar
        },
        body: JSON.stringify(habitacionFinal)
      });
      mostrarToast('Habitación actualizada correctamente.', 'success');
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 🛡️ Pase VIP para crear
        },
        body: JSON.stringify(habitacionFinal)
      });
      mostrarToast('Habitación registrada con éxito.', 'success');
    }
    cancelarFormulario();
    cargarDatos();
  } catch (error) {
    mostrarToast('Ocurrió un error al guardar.', 'error');
  }
};

// 3. ELIMINAR (DELETE)
const eliminarHabitacion = async () => {
  const idHabitacion = habitaciones.value[indiceAEliminar.value].id;

  const token = localStorage.getItem('token_dalam');

  try {
    await fetch(`${API_URL}/${idHabitacion}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    mostrarToast('Habitación eliminada.', 'error');
    modalEliminar.value = false;
    cargarDatos();
  } catch (error) {
    mostrarToast('No se pudo eliminar la habitación.', 'error');
  }
};

// LÓGICA DE INTERFAZ
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
  window.scrollTo({top: 0, behavior: 'smooth'});
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