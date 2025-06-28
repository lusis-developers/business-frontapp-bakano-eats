import type { IBusiness } from '@/types/models/IBusiness'
import APIBase from './APIBase'
import type {
  CreateBusinessPayload,
  CreateBusinessResponse,
  GetMenuResponse,
  UpdateSchedulePayload,
  UpdateScheduleResponse,
} from '@/types/api.type'

class BusinessService extends APIBase {
  constructor() {
    super()
  }

  /**
   * Obtiene los datos del negocio asociado al usuario actualmente autenticado.
   * Llama al nuevo endpoint GET /api/business/me.
   * @returns Una promesa que resuelve con los datos del negocio.
   */
  public async getMyBusiness(): Promise<IBusiness> {
    // El 'get' es heredado de APIBase. Tu controller devuelve el objeto de negocio directamente.
    const response = await this.get<IBusiness>('business/me')
    return response.data
  }

  /**
   * Envía los datos para registrar un nuevo negocio para el usuario autenticado.
   * Llama al endpoint POST /api/business/create.
   * @param payload - Los datos del negocio a crear.
   * @returns Una promesa que resuelve con el mensaje y el negocio creado.
   */
  public async create(payload: CreateBusinessPayload): Promise<CreateBusinessResponse> {
    // El 'post' es heredado de APIBase.
    const response = await this.post<CreateBusinessResponse>('business/create', payload)
    return response.data
  }

  /**
   * NUEVO: Actualiza el horario completo de un negocio.
   * Llama al endpoint PATCH /api/business/:businessId/schedule.
   * @param businessId - El ID del negocio a actualizar.
   * @param payload - El array completo con el nuevo horario.
   * @returns Una promesa que resuelve con los datos del negocio actualizado.
   */
  public async updateSchedule(
    businessId: string,
    payload: UpdateSchedulePayload,
  ): Promise<UpdateScheduleResponse> {
    // <-- CAMBIO AQUÍ
    // La implementación sigue siendo correcta, ahora el tipo coincide.
    const response = await this.patch<UpdateScheduleResponse>(
      `business/${businessId}/schedule`,
      payload,
    )
    return response.data
  }

  /**
   * NUEVO: Obtiene el negocio con su menú completamente poblado.
   * @param businessId El ID del negocio.
   * @returns La respuesta de la API con el objeto de negocio/menú.
   */
  public async getMenu(businessId: string): Promise<GetMenuResponse> {
    const response = await this.get<GetMenuResponse>(`${businessId}/menu`)
    return response.data
  }
}

// Exportamos una única instancia para ser usada en toda la aplicación.
export const businessService = new BusinessService()
