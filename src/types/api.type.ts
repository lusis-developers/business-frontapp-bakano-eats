import type { IBusiness, IBusinessHours } from './models/IBusiness'
import type { IDish } from './models/IDish'
import type { IDrink } from './models/IDrink'
import type { IOrder } from './models/IOrder'
import type { IUser } from './models/IUser'

// Payload para enviar a /auth/login
export interface LoginCredentials {
  email: string
  password: string
}

// Respuesta que esperamos de /auth/login
export interface LoginResponse {
  message: string
  token: string
}

// Payload para enviar a /auth/register
export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}

// Respuesta que esperamos de /auth/register
export interface RegisterResponse {
  message: string
  user: IUser
}

/**
 * Payload que se envía al backend para crear un nuevo negocio.
 * Basado en tu `createBusinessController`.
 */
export interface CreateBusinessPayload {
  name: string
  description: string
  address: string
  phone: string
}

/**
 * Respuesta esperada del backend tras crear un negocio con éxito.
 */
export interface CreateBusinessResponse {
  message: string
  business: null
}

export type UpdateSchedulePayload = IBusinessHours[]

/**
 * NUEVO: Define la forma del objeto que la API devuelve
 * al actualizar el horario con éxito.
 */
export interface UpdateScheduleResponse {
  message: string
  business: IBusiness
}

export interface CreateDishPayload {
  name: string
  description: string
  price: number
  category: 'Entrante' | 'Plato Fuerte' | 'Postre' | 'Sopa'
  imageUrl?: string
}

/**
 * NUEVO: Respuesta de la API al crear un platillo.
 */
export interface CreateDishResponse {
  message: string
  dish: IDish
}

export interface GetMenuResponse {
  message: string
  menu: IBusiness
}

export interface CreateDishPayload {
  name: string
  description: string
  price: number
  category: 'Entrante' | 'Plato Fuerte' | 'Postre' | 'Sopa'
  imageUrl?: string
}

export type UpdateDishPayload = Partial<CreateDishPayload>

export interface CreateDishResponse {
  message: string
  dish: IDish
}

export type UpdateDishResponse = CreateDishResponse

export interface DeleteDishResponse {
  message: string
  deletedDishId: string
  dishDeleted: IDish
}

export interface CreateDrinkPayload {
  name: string
  description: string
  price: number
  category: 'Gaseosa' | 'Jugo Natural' | 'Bebida Energética' | 'Licor'
  size?: string
  imageUrl?: string
}

export type UpdateDrinkPayload = Partial<CreateDrinkPayload>

// Opcional pero recomendado: un tipo para la respuesta de la API
export interface CreateDrinkResponse {
  message: string
  drink: IDrink
}

export interface DrinkResponse {
  message: string
  drink: IDrink
}

/**
 * Respuesta de la API al eliminar una bebida.
 */
export interface DeleteDrinkResponse {
  message: string
  deletedDrinkId: string
  drinkDeleted: IDrink
}

export interface OrderItemPayload {
  itemId: string
  itemType: 'Dish' | 'Drink'
  quantity: number
}

export type EditOrderPayload = Partial<Omit<CreateOrderPayload, 'items'>> & {
  items?: OrderItemPayload[]
  status?: IOrder['status']
}

export interface CreateOrderPayload {
  customerName: string
  customerPhone: string
  customerAddress: string
  items: OrderItemPayload[]
  paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta'
  salesChannel: 'WhatsApp' | 'Instagram' | 'Presencial'
  deliveryType: 'Pickup' | 'Delivery'
  comments?: string
}

export interface CreateOrderResponse {
  message: string
  order: IOrder
}

export interface GetOrdersResponse {
  message: string
  orders: IOrder[]
}

/**
 * NUEVO: El payload que enviaremos para actualizar el estado de una orden.
 * Corresponde a la ruta PATCH /api/business/:businessId/orders/:orderId
 */
export interface UpdateOrderStatusPayload {
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'
}

/**
 * NUEVO: La respuesta que esperamos de la API al actualizar una orden.
 */
export interface UpdateOrderResponse {
  message: string
  order: IOrder
}
