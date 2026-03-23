import {createRouter, createWebHistory} from 'vue-router'

import Alta from './views/Alta.vue'
import Home from './views/Home.vue'
import Habitaciones from './views/Habitaciones.vue'
import Contacto from './views/Contacto.vue'
import Conocenos from './views/Conocenos.vue'
import Galeria from './views/Galeria.vue'
import ManejoHabitaciones from "@/views/ManejoHabitaciones.vue";

const routes = [
    {path: '/', component: Home},
    {path: '/habitaciones', component: Habitaciones},
    {path: '/contacto', component: Contacto},
    {path: '/conocenos', component: Conocenos},
    {path: '/galeria', component: Galeria},
    { path: '/alta', component: Alta },
    {
        path: '/reservar/', name: 'reservar', component: () => import('./components/Checkout.vue')
    },
    {path: '/manejos', component: ManejoHabitaciones},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

