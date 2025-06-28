import type { CreateDishPayload, CreateDishResponse } from '@/types/api.type'
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

  // En el futuro, los métodos para actualizar y borrar irían aquí.
  // public async update(...) {}
  // public async remove(...) {}
}

export const dishService = new DishService()
