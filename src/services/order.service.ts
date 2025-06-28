import type {
  CreateOrderPayload,
  CreateOrderResponse,
  EditOrderPayload,
  GetOrdersResponse,
  UpdateOrderResponse,
} from '@/types/api.type'
import APIBase from './APIBase'

class OrderService extends APIBase {
  /**
   * Llama al endpoint para crear una nueva orden para un negocio.
   * @param businessId El ID del negocio.
   * @param payload Los datos de la nueva orden.
   */
  public async create(
    businessId: string,
    payload: CreateOrderPayload,
  ): Promise<CreateOrderResponse> {
    const response = await this.post<CreateOrderResponse>(`business/${businessId}/orders`, payload)
    return response.data
  }

  /**
   * NUEVO: Llama al endpoint para actualizar parcialmente una orden (estado o datos).
   * Corresponde a la ruta: PATCH /api/business/:businessId/orders/:orderId
   * @param businessId El ID del negocio.
   * @param orderId El ID de la orden a actualizar.
   * @param payload Los datos que se desean modificar.
   * @returns La respuesta de la API con la orden actualizada.
   */
  public async update(
    businessId: string,
    orderId: string,
    payload: EditOrderPayload,
  ): Promise<UpdateOrderResponse> {
    // Usamos el método 'patch' de nuestra clase APIBase.
    const url = `business/${businessId}/orders/${orderId}`
    const response = await this.patch<UpdateOrderResponse>(url, payload)
    return response.data
  }

  /**
   * NUEVO: Llama al endpoint para obtener todas las órdenes de un negocio.
   * Corresponde a la ruta: GET /api/business/:businessId/orders
   * @param businessId El ID del negocio del cual se quieren obtener las órdenes.
   * @returns La respuesta de la API con el listado de órdenes.
   */
  public async getAll(businessId: string): Promise<GetOrdersResponse> {
    // Usamos el método 'get' de nuestra clase APIBase.
    const url = `business/${businessId}/orders`
    const response = await this.get<GetOrdersResponse>(url)
    return response.data
  }
}

export const orderService = new OrderService()
