import type { IBusiness, IBusinessHours } from './models/IBusiness'
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
