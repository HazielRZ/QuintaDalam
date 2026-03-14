<script setup>
import { ref } from 'vue'
// Importamos los datos iniciales de tu JSON
import habitacionesData from '../Json/habitaciones.json'

// 1. ESTADO DE LA APLICACIÓN

const habitaciones = ref([...habitacionesData])

// Variable para saber si estamos creando una nueva o editando una existente
const modoEdicion = ref(false)

// Objeto reactivo conectado al formulario mediante v-model
const form = ref({
  id: '',
  nombre: '',
  capacidad: 1,
  precioBase: 0,
  estado: 'disponible',
  descripcion: ''
})

// 2. FUNCIONES DEL CRUD

// Función para limpiar el formulario
const limpiarFormulario = () => {
  form.value = {
    id: '', nombre: '', capacidad: 1, precioBase: 0, estado: 'disponible', descripcion: ''
  }
  modoEdicion.value = false
}

// Guardar (Crear nueva o Actualizar existente)
const guardarHabitacion = () => {
  // Buscamos si la habitación ya existe
  const index = habitaciones.value.findIndex(h => h.id === form.value.id)

  const nuevaHab = {
    id: form.value.id,
    nombre: form.value.nombre,
    capacidad: form.value.capacidad,
    precioBase: form.value.precioBase,
    descripcion: form.value.descripcion,
    disponible: form.value.estado === 'disponible',
    tipo: "Estándar",
    amenidades: [],
    imagenes: ["/src/images/Habitacion.jpg"]
  }

  if (modoEdicion.value && index !== -1) {
    habitaciones.value[index] = { ...habitaciones.value[index], ...nuevaHab }
  } else {
    // Si no existe, la agregamos a la lista
    habitaciones.value.push(nuevaHab)
  }

  limpiarFormulario()
}

// Preparar formulario para Editar
const editarHabitacion = (hab) => {
  form.value = {
    id: hab.id,
    nombre: hab.nombre,
    capacidad: hab.capacidad,
    precioBase: hab.precioBase,
    estado: hab.disponible ? 'disponible' : 'ocupada',
    descripcion: hab.descripcion
  }
  modoEdicion.value = true
}

// Eliminar
const eliminarHabitacion = (id) => {
  if (confirm('¿Estás seguro de eliminar esta habitación?')) {
    habitaciones.value = habitaciones.value.filter(h => h.id !== id)
  }
}

// Utilidad para formato de moneda en la tabla
const formatoMoneda = (valor) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor)
}
</script>

<template>
  <div class="admin-container">
    <main class="main-content">
      <header class="topbar">
        <h2>Gestión de Habitaciones</h2>
        <div class="user-info">
          <span class="role">Admin</span>
        </div>
      </header>

      <div class="content-wrapper">

        <section class="crud-section form-section booking-bar">
          <div class="section-header">
            <h3>{{ modoEdicion ? 'Editar Habitación' : 'Registrar Habitación' }}</h3>
          </div>

          <form class="booking-form" @submit.prevent="guardarHabitacion">

            <div class="form-grid">
              <div class="input-group">
                <label for="id-hab">ID Habitación</label>
                <input id="id-hab" v-model="form.id" placeholder="Ej. 103" type="text" :disabled="modoEdicion" required>
              </div>

              <div class="input-group">
                <label for="nombre">Nombre / Temática</label>
                <input id="nombre" v-model="form.nombre" placeholder="Ej. Suite Pátzcuaro" type="text" required>
              </div>

              <div class="input-group">
                <label for="capacidad">Capacidad</label>
                <input id="capacidad" v-model="form.capacidad" min="1" placeholder="Ej. 2" type="number" required>
              </div>

              <div class="input-group">
                <label for="precio">Precio (MXN)</label>
                <input id="precio" v-model="form.precioBase" placeholder="Ej. 1500.00" step="0.01" type="number" required>
              </div>

              <div class="input-group">
                <label for="estado">Estado</label>
                <select id="estado" v-model="form.estado">
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>
            </div>

            <div class="form-actions-container full-width">
              <div class="input-group">
                <label for="descripcion">Descripción Breve</label>
                <textarea id="descripcion" v-model="form.descripcion" placeholder="Detalles..." rows="2" required></textarea>
              </div>

              <div class="button-group" style="margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
                <button class="btn-check" style="background-color: #666;" type="button" @click="limpiarFormulario">Cancelar</button>
                <button class="btn-check" type="submit">{{ modoEdicion ? 'Actualizar' : 'Guardar' }}</button>
              </div>
            </div>
          </form>
        </section>

        <section class="crud-section table-section">
          <div class="table-header">
            <h3>Inventario de Habitaciones</h3>
            <input class="search-input" placeholder="Buscar habitación..." type="text">
          </div>

          <div class="table-responsive">
            <table class="crud-table">
              <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="hab in habitaciones" :key="hab.id">
                <td>{{ hab.id }}</td>
                <td>{{ hab.nombre }}</td>
                <td>{{ hab.capacidad }}</td>
                <td>
                    <span :class="['badge', hab.disponible ? 'available' : 'occupied']">
                      {{ hab.disponible ? 'Disponible' : 'Ocupada' }}
                    </span>
                </td>
                <td>{{ formatoMoneda(hab.precioBase) }}</td>
                <td class="actions" style="display: flex; gap: 5px;">
                  <button class="btn" style="background-color: var(--pink-vibrant); color: white;" @click="editarHabitacion(hab)">Editar</button>
                  <button class="btn" style="background-color: #e74c3c; color: white;" @click="eliminarHabitacion(hab.id)">Eliminar</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<style scoped>


.form-grid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.full-width {
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.input-group input,
.input-group select,
.input-group textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}


.badge {
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
}

.badge.available {
  background-color: #d4edda;
  color: #155724;
}

.badge.occupied {
  background-color: #f8d7da;
  color: #721c24;
}

/* 3. Hacer la tabla responsiva */
.table-responsive {
  overflow-x: auto;
}

.crud-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.crud-table th, .crud-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.crud-table th {
  background-color: #f8f9fa;
  color: #333;
}
</style>