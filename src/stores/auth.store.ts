import { defineStore } from 'pinia'
import router from '@/router'
import type { IUser } from '@/types/models/IUser'
import type { LoginCredentials, RegisterPayload } from '@/types/api.type'
import { authService } from '@/services/auth.service'

interface AuthState {
  user: IUser | null
  token: string | null
  isLoading: boolean
  error: string | null
}

function decodeJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    console.error('Error decoding JWT', e)
    return null
  }
}

const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('authToken'),
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userRole: (state) => state.user?.role,
  },

  // 3. ACTIONS: Métodos que pueden ser asíncronos y modifican el estado usando 'this'.
  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      this.error = null
      try {
        const response = await authService.login(credentials)

        const authToken = response.token
        this.token = authToken
        localStorage.setItem('authToken', authToken)

        const decodedPayload = decodeJwt(authToken)
        if (decodedPayload) {
          this.user = {
            _id: decodedPayload.id,
            email: decodedPayload.email,
            role: decodedPayload.role,
          } as IUser
        }

        await router.push('/dashboard')
      } catch (e: any) {
        this.error = e.message || 'Error al iniciar sesión.'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async register(payload: RegisterPayload) {
      this.isLoading = true
      this.error = null
      try {
        await authService.register(payload)
        await router.push({ name: 'login', query: { registered: 'true' } })
      } catch (e: any) {
        this.error = e.message || 'No se pudo completar el registro.'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('authToken')
      router.push('/login')
    },

    initializeAuth() {
      if (this.token) {
        const decodedPayload = decodeJwt(this.token)
        if (decodedPayload) {
          this.user = {
            _id: decodedPayload.id,
            email: decodedPayload.email,
            role: decodedPayload.role,
          } as IUser
        } else {
          this.logout()
        }
      }
    },
  },
})

export default useAuthStore
