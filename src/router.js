import { createRouter, createWebHistory } from 'vue-router'

// Importamos todas nuestras vistas
import Home from './views/Home.vue'
import Habitaciones from './views/Habitaciones.vue'
import Contacto from './views/Contacto.vue'
import Conocenos from './views/Conocenos.vue'
import Galeria from './views/Galeria.vue'
import Checkout from './components/Checkout.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/habitaciones', component: Habitaciones },
    { path: '/contacto', component: Contacto },
    { path: '/conocenos', component: Conocenos },
    { path: '/galeria', component: Galeria },
    { path: '/reservar', component: Checkout }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router