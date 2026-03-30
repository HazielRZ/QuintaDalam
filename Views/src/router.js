import {createRouter, createWebHistory} from 'vue-router'

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
    {  path: '/login',
    name: 'login',
    component: () => import('./views/Login.vue')
},
{
    path: '/alta',
        name: 'alta',
    component: () => import('./views/Alta.vue'),
    meta: { requiresAuth: true }
},
    {
        path: '/reservar/', name: 'reservar', component: () => import('./components/Checkout.vue')
    },
    {path: '/manejos', component: ManejoHabitaciones},
    {
        path: '/admin/reservas',
        name: 'admin-reservas',
        component: () => import('./views/AdminReservas.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        name: 'admin-lobby',
        component: () => import('./views/AdminLobby.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/ticket',
        name: 'ticket',
        component: () => import('./views/Ticket.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token_dalam');

    if (to.meta.requiresAuth && !token) {
        next('/login');
    }
    else if (to.path === '/login' && token) {
        next('/admin');
    }
    else {
        next();
    }
})

export default router