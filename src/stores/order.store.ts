import { orderService } from '@/services/order.service'
import type { CreateOrderPayload, UpdateOrderStatusPayload } from '@/types/api.type'
import type { IOrder } from '@/types/models/IOrder'
import { defineStore } from 'pinia'

interface OrderState {
  orders: IOrder[]
  isLoading: boolean
  error: string | null
}

const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    orders: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async createOrder(businessId: string, payload: CreateOrderPayload) {
      this.isLoading = true
      this.error = null
      try {
        const response = await orderService.create(businessId, payload)
        // Añadimos la nueva orden al principio de la lista para una UI reactiva
        this.orders.unshift(response.order)
      } catch (e: any) {
        this.error = e.message || 'No se pudo crear la orden.'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Actualiza el estado de una orden específica (ej: de 'pending' a 'confirmed').
     * @param businessId El ID del negocio.
     * @param orderId El ID de la orden a actualizar.
     * @param payload El nuevo estado para la orden.
     */
    async updateOrderStatus(
      businessId: string,
      orderId: string,
      payload: UpdateOrderStatusPayload,
    ) {
      try {
        // --- LA CORRECCIÓN ESTÁ AQUÍ ---
        const response = await orderService.update(businessId, orderId, payload)

        const updatedOrder = response.order

        // Actualizamos la orden en nuestro array local para una UI súper reactiva.
        const index = this.orders.findIndex((o) => o._id === updatedOrder._id)
        if (index !== -1) {
          this.orders[index] = updatedOrder
        }
      } catch (e: any) {
        // En lugar de un error global, lo mostramos en la consola.
        console.error('Error al actualizar el estado de la orden:', e.message)
      }
    },
  },
})

export default useOrderStore
