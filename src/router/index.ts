// Fichero: src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// Importamos las vistas que vamos a crear
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import useAuthStore from '@/stores/auth.store'
// import DashboardView from '../views/DashboardView.vue'

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
  ],
})

// Navigation Guard: se ejecuta antes de cada cambio de ruta.
router.beforeEach((to, from, next) => {
  // Pinia no está disponible aquí hasta que la app se monte,
  // por eso no podemos llamar a useAuthStore() en el top-level.
  const authStore = useAuthStore()

  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y no estamos logueados, vamos a login.
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    // Si ya estamos logueados, no tiene sentido ver la página de login.
    next({ name: 'dashboard' })
  } else {
    // En cualquier otro caso, permitimos el acceso.
    next()
  }
})

export default router
