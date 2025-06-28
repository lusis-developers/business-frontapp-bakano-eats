import type { IUser } from './models.types'

// Payload para el endpoint de login
export interface LoginCredentials {
  email: string
  password: string
}

// Payload para el endpoint de registro
export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}

// Respuesta esperada del endpoint de login
export interface LoginResponse {
  message: string
  token: string
}

// Respuesta esperada del endpoint de registro
export interface RegisterResponse {
  message: string
  user: IUser
}
