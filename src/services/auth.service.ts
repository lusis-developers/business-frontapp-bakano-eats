import type {
  LoginCredentials,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from '@/types/api.type'
import APIBase from './APIBase'

class AuthService extends APIBase {
  constructor() {
    super()
  }

  public async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>('login', credentials)
    return response.data
  }
  public async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await this.post<RegisterResponse>('register', payload)
    return response.data
  }
}

export const authService = new AuthService()
