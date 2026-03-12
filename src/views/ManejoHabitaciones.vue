<script setup>

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
            <h3>Registrar / Editar Habitación</h3>
          </div>

          <form class="booking-form">

            <div class="input-group">
              <label for="id-hab">ID Habitación</label>
              <input id="id-hab" placeholder="Ej. HAB-001" type="text">
            </div>

            <div class="input-group">
              <label for="nombre">Nombre / Temática</label>
              <input id="nombre" placeholder="Ej. Suite Pátzcuaro" type="text">
            </div>

            <div class="input-group">
              <label for="capacidad">Capacidad</label>
              <input id="capacidad" min="1" placeholder="Ej. 2" type="number">
            </div>

            <div class="input-group">
              <label for="precio">Precio (MXN)</label>
              <input id="precio" placeholder="Ej. 1500.00" step="0.01" type="number">
            </div>

            <div class="input-group">
              <label for="estado">Estado</label>
              <select id="estado">
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>

            <div class="form-actions-container">
              <div class="input-group full-width">
                <label for="descripcion">Descripción Breve</label>
                <textarea id="descripcion" placeholder="Detalles..." rows="1"></textarea>
              </div>

              <div class="button-group">
                <button class="btn-check" type="reset">Limpiar</button>
                <button class="btn-check" type="submit">Guardar</button>
              </div>
            </div>
          </form>
        </section>
        <section class="crud-section table-section">

          <div class="table-header">

            <h3>Inventario de Habitaciones </h3>

            <input class="search-input" placeholder="Buscar habitación..." type="text">

          </div>


          <div class="booking-form">

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

              <tr>

                <td>HAB-001</td>

                <td>Suite Tzintzuntzan</td>

                <td>2</td>

                <td><span class="badge available">Disponible</span></td>

                <td>$1,800.00</td>

                <td class="actions">

                  <button class="btn ">Editar</button>

                  <button class="btn ">Eliminar</button>

                </td>

              </tr>

              <tr>

                <td>HAB-002</td>

                <td>Doble Santa Clara</td>

                <td>4</td>

                <td><span class="badge occupied">Ocupada</span></td>

                <td>$2,500.00</td>

                <td class="actions">

                  <button class="btn">Editar</button>

                  <button class="btn">Eliminar</button>

                </td>

              </tr>

              </tbody>

            </table>

          </div>

        </section>


      </div>

    </main>
  </div>
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