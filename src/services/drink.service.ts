import type {
  CreateDrinkPayload,
  DeleteDrinkResponse,
  DrinkResponse,
  UpdateDrinkPayload,
} from '@/types/api.type'
import APIBase from './APIBase'

class DrinkService extends APIBase {
  /**
   * Llama al endpoint para crear una nueva bebida para un negocio.
   * @param businessId El ID del negocio.
   * @param payload Los datos de la nueva bebida.
   * @returns La respuesta de la API con la bebida creada.
   */
  public async create(businessId: string, payload: CreateDrinkPayload): Promise<DrinkResponse> {
    const response = await this.post<DrinkResponse>(`business/${businessId}/drinks`, payload)
    return response.data
  }

  /**
   * Llama al endpoint para actualizar una bebida existente.
   * @param businessId El ID del negocio.
   * @param drinkId El ID de la bebida a actualizar.
   * @param payload Los datos a actualizar.
   * @returns La respuesta de la API con la bebida actualizada.
   */
  public async update(
    businessId: string,
    drinkId: string,
    payload: UpdateDrinkPayload,
  ): Promise<DrinkResponse> {
    const response = await this.patch<DrinkResponse>(
      `business/${businessId}/drinks/${drinkId}`,
      payload,
    )
    return response.data
  }

  /**
   * Llama al endpoint para eliminar una bebida.
   * @param businessId El ID del negocio.
   * @param drinkId El ID de la bebida a eliminar.
   * @returns La respuesta de la API confirmando la eliminación.
   */
  public async remove(businessId: string, drinkId: string): Promise<DeleteDrinkResponse> {
    const response = await this.delete<DeleteDrinkResponse>(
      `business/${businessId}/drinks/${drinkId}`,
    )
    return response.data
  }
}

// Exportamos una única instancia para ser usada en toda la aplicación.
export const drinkService = new DrinkService()
