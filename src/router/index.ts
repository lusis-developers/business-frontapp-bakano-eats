// Fichero: src/router/index.ts (Versión Corregida y Completa)

import { createRouter, createWebHistory } from 'vue-router'
import useAuthStore from '@/stores/auth.store'

// Importamos todas las vistas que usaremos
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue' // <-- Descomentamos y usamos esta

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }, // <-- Esta meta-información es la clave
    },
    {
      // ¡AQUÍ ESTÁ EL CAMBIO! Activamos la ruta del menú.
      path: '/menu',
      name: 'menu',
      // Usamos "lazy loading" (carga perezosa) para esta vista.
      component: () => import('@/views/MenuView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      // La cargamos de forma perezosa para un rendimiento óptimo
      component: () => import('@/views/OrdersView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation Guard: Nuestro vigilante de rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Para que esto funcione en recargas de página, es VITAL que llames
  // a `authStore.initializeAuth()` cuando la app se monta (lo haremos en App.vue).
  const isAuthenticated = authStore.isAuthenticated

  const requiresAuth = to.meta.requiresAuth

  // Caso 1: La ruta requiere login y el usuario NO está autenticado
  if (requiresAuth && !isAuthenticated) {
    // Lo mandamos al login.
    next({ name: 'login' })
  }
  // Caso 2: El usuario está autenticado e intenta ir a Login o Register
  else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    // No tiene sentido, lo mandamos a su dashboard.
    next({ name: 'dashboard' })
  }
  // Caso 3: Cualquier otra situación (acceso permitido)
  else {
    next()
  }
})

export default router
