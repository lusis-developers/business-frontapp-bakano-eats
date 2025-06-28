import { dishService } from '@/services/dish.service'
import type { CreateDishPayload } from '@/types/api.type'
import type { IDish, IDrink } from '@/types/models/IBusiness'
import { defineStore } from 'pinia'

interface MenuState {
  dishes: IDish[]
  drinks: IDrink[]
  isLoading: boolean
  error: string | null
}

const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    dishes: [],
    drinks: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    isMenuEmpty: (state) => state.dishes.length === 0 && state.drinks.length === 0,
  },

  actions: {
    /**
     * Acción para inicializar el estado del menú.
     * Será llamada por el business.store cuando obtenga los datos del negocio.
     */
    setMenu(dishes: IDish[], drinks: IDrink[]) {
      this.dishes = dishes
      this.drinks = drinks
    },

    /**
     * Añade un platillo al menú.
     */
    async addDish(businessId: string, payload: CreateDishPayload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await dishService.create(businessId, payload)
        this.dishes.push(response.dish)
      } catch (e: any) {
        this.error = e.message || 'No se pudo añadir el platillo.'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    // Aquí irían las acciones para addDrink, updateDish, deleteDish, etc.
  },
})

export default useMenuStore
