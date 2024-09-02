import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import { type ApiResponse } from '../types/api.interface'
import type { LoginRequest, LoginResponse } from '../types/auth.interface'

class AuthService {
  static async Login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await AxiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', request)

      return response.data
    } catch (error) {
      return handleHttpError<LoginResponse>(error)
    }
  }
}

export default AuthService
