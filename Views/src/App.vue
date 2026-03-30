<template>
  <nav aria-label="Primary" class="site-nav">
    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/habitaciones">Habitaciones</router-link>
      </li>
      <li>
        <router-link to="/contacto">Contacto</router-link>
      </li>
      <li>
        <router-link to="/conocenos">Conocenos</router-link>
      </li>
      <li>
        <router-link to="/galeria">Galeria</router-link>
      </li>
    </ul>
  </nav>

  <router-view></router-view>

</template>

<style>

</style>