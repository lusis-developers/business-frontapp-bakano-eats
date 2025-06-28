import { businessService } from '@/services/business.service'
import type { CreateBusinessPayload } from '@/types/api.type'
import type { IBusiness, IBusinessHours } from '@/types/models/IBusiness'
import type { IDish } from '@/types/models/IDish'
import type { IDrink } from '@/types/models/IDrink'
import { defineStore } from 'pinia'

// Interfaz para la forma del estado de este store.
interface BusinessState {
  business: IBusiness | null
  isLoading: boolean
  error: string | null
}

const useBusinessStore = defineStore('business', {
  state: (): BusinessState => ({
    business: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    hasBusiness: (state) => !!state.business,
    hasSchedule: (state) => !!state.business?.schedule && state.business.schedule.length > 0,
    // Getters del menú que leen del estado 'business'
    dishes: (state): IDish[] => state.business?.dishes || [],
    drinks: (state): IDrink[] => state.business?.drinks || [],
    isMenuEmpty(state): boolean {
      return this.dishes.length === 0 && this.drinks.length === 0
    },
  },

  actions: {
    /**
     * Busca los datos del negocio del usuario autenticado.
     * Es la acción principal que se llamará al entrar al Dashboard.
     */
    async fetchBusinessData() {
      this.isLoading = true
      this.error = null
      try {
        const businessData = await businessService.getMyBusiness()
        this.business = businessData
      } catch (e: any) {
        // Un error 404 aquí no es un fallo, significa que el usuario es nuevo.
        // Lo manejamos con gracia para que la UI muestre el prompt de creación.
        if (e.status === 404) {
          this.business = null
        } else {
          // Para cualquier otro error, sí lo mostramos.
          this.error = e.message || 'No se pudieron cargar los datos de tu negocio.'
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Crea un nuevo negocio y, si tiene éxito, refresca los datos.
     * @param payload Los datos del nuevo negocio.
     */
    async createBusiness(payload: CreateBusinessPayload) {
      this.isLoading = true
      this.error = null
      try {
        await businessService.create(payload)

        // ¡LA MAGIA! Después de crear, volvemos a llamar a fetchBusinessData.
        // Esto actualizará el estado y la UI cambiará automáticamente
        // del prompt de creación al dashboard real.
        await this.fetchBusinessData()
      } catch (e: any) {
        this.error = e.message || 'Hubo un error al crear el negocio.'
        throw e // Relanzamos para que el componente (modal) sepa que hubo un error.
      } finally {
        this.isLoading = false
      }
    },

    /**
     * NUEVO: Llama al servicio para actualizar el horario del negocio.
     * @param scheduleData - El array con los 7 días de la semana.
     */
    async updateSchedule(scheduleData: IBusinessHours[]) {
      if (!this.business) {
        this.error = 'No se puede actualizar el horario porque no hay un negocio seleccionado.'
        return
      }

      this.isLoading = true
      this.error = null
      try {
        const businessId = this.business._id

        // El servicio ahora devuelve el objeto { message, business }
        const response = await businessService.updateSchedule(businessId, scheduleData)

        // --- LA CORRECCIÓN MÁGICA ---
        // Extraemos la propiedad 'business' de la respuesta y la asignamos al estado.
        this.business = response.business
      } catch (e: any) {
        this.error = e.message || 'Hubo un error al guardar el horario.'
        throw e
      } finally {
        this.isLoading = false
      }
    },
  },
})

export default useBusinessStore
