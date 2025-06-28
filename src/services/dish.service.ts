import type {
  CreateDishPayload,
  CreateDishResponse,
  DeleteDishResponse,
  UpdateDishPayload,
  UpdateDishResponse,
} from '@/types/api.type'
import APIBase from './APIBase'

class DishService extends APIBase {
  /**
   * Llama al endpoint para crear un nuevo platillo para un negocio específico.
   * @param businessId El ID del negocio.
   * @param payload Los datos del nuevo platillo.
   * @returns La respuesta de la API con el platillo creado.
   */
  public async create(businessId: string, payload: CreateDishPayload): Promise<CreateDishResponse> {
    const response = await this.post<CreateDishResponse>(`business/${businessId}/dishes`, payload)
    return response.data
  }

  public async update(
    businessId: string,
    dishId: string,
    payload: UpdateDishPayload,
  ): Promise<UpdateDishResponse> {
    const response = await this.patch<UpdateDishResponse>(
      `business/${businessId}/dishes/${dishId}`,
      payload,
    )
    return response.data
  }

  public async remove(businessId: string, dishId: string): Promise<DeleteDishResponse> {
    const response = await this.delete<DeleteDishResponse>(
      `business/${businessId}/dishes/${dishId}`,
    )
    return response.data
  }
}

export const dishService = new DishService()
