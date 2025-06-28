import { businessService } from '@/services/business.service'
import { dishService } from '@/services/dish.service'
import { drinkService } from '@/services/drink.service'
import type {
  CreateDishPayload,
  CreateDrinkPayload,
  UpdateDishPayload,
  UpdateDrinkPayload,
} from '@/types/api.type'
import type { IDish } from '@/types/models/IDish'
import type { IDrink } from '@/types/models/IDrink'
import emitter from '@/utils/emitter'
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
        emitter.emit('menu-updated')
        this.dishes.push(response.dish)
      } catch (e: any) {
        this.error = e.message || 'No se pudo añadir el platillo.'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async updateDish(businessId: string, dishId: string, payload: UpdateDishPayload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await dishService.update(businessId, dishId, payload)
        const updatedDish = response.dish

        // Buscamos el índice del platillo viejo y lo reemplazamos por el actualizado.
        // Esto es mucho más eficiente que volver a cargar toda la lista.
        const index = this.dishes.findIndex((d) => d._id === updatedDish._id)
        if (index !== -1) {
          this.dishes[index] = updatedDish
        }
        emitter.emit('menu-updated')
      } catch (e: any) {
        this.error = e.message || 'No se pudo actualizar el platillo.'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async deleteDish(businessId: string, dishId: string) {
      this.isLoading = true
      this.error = null
      try {
        // Ahora sí llamamos al servicio real.
        await dishService.remove(businessId, dishId)

        // Si la llamada a la API tiene éxito, actualizamos el estado local.
        this.dishes = this.dishes.filter((d) => d._id !== dishId)

        emitter.emit('menu-updated')
      } catch (e: any) {
        this.error = 'No se pudo eliminar el platillo.'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    /**
     * NUEVO: Añade una bebida al menú.
     * @param businessId El ID del negocio.
     * @param payload Los datos de la bebida a crear.
     */
    async addDrink(businessId: string, payload: CreateDrinkPayload) {
      this.isLoading = true
      this.error = null
      try {
        // Llamamos al servicio de bebidas (que crearemos en el siguiente paso si no existe)
        const response = await drinkService.create(businessId, payload)
        this.drinks.push(response.drink)

        emitter.emit('menu-updated')
      } catch (e: any) {
        this.error = e.message || 'No se pudo añadir la bebida.'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async updateDrink(businessId: string, drinkId: string, payload: UpdateDrinkPayload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await drinkService.update(businessId, drinkId, payload)
        const updatedDrink = response.drink
        const index = this.drinks.findIndex((d) => d._id === updatedDrink._id)
        if (index !== -1) {
          this.drinks[index] = updatedDrink
        }
        emitter.emit('menu-updated')
      } catch (e: any) {
        this.error = e.message || 'No se pudo actualizar la bebida.'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async deleteDrink(businessId: string, drinkId: string) {
      this.isLoading = true
      this.error = null
      try {
        await drinkService.remove(businessId, drinkId)
        this.drinks = this.drinks.filter((d) => d._id !== drinkId)
        emitter.emit('menu-updated')
      } catch (e: any) {
        this.error = 'No se pudo eliminar la bebida.'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async fetchMenu(businessId: string) {
      this.isLoading = true
      this.error = null
      try {
        const response = await businessService.getMenu(businessId)
        // Usamos la acción 'setMenu' para actualizar el estado de forma centralizada.
        this.setMenu(response.menu.dishes, response.menu.drinks)
      } catch (e: any) {
        this.error = 'No se pudo cargar el menú.'
      } finally {
        this.isLoading = false
      }
    },
  },
})

export default useMenuStore
