import type { IUser } from './models.types'

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
