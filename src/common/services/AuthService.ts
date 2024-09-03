import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import { type ApiResponse } from '../types/api.interface'
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest
} from '../types/auth.interface'

export default class AuthService {
  static async Login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await AxiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', request)

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async Register(request: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await AxiosInstance.post<ApiResponse<RegisterResponse>>(
        '/auth/register',
        request
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async ChangePassword(
    request: ChangePasswordRequest
  ): Promise<ApiResponse<ChangePasswordResponse>> {
    try {
      const response = await AxiosInstance.post<ApiResponse<ChangePasswordResponse>>(
        '/auth/change-password',
        request
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async SendResetPassword(email: string): Promise<ApiResponse<null>> {
    try {
      const response = await AxiosInstance.post<ApiResponse<null>>('/auth/send-reset-password', {
        email
      })

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async ResetPassword(request: ResetPasswordRequest): Promise<ApiResponse<null>> {
    try {
      const response = await AxiosInstance.post<ApiResponse<null>>('/auth/reset-password', request)

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }
}
