import { type ApiResponse } from '../types/api.interface'
import AxiosInstance from './AxiosInstance'
import type { LoginRequest } from '../types/auth.interface'
import { isAxiosError } from 'axios'

export default class AuthService {
  static async Login(request: LoginRequest): Promise<ApiResponse<string>> {
    try {
      const response = await AxiosInstance.post<ApiResponse<string>>('/auth/login', request)

      return response.data
    } catch (error) {
      console.log(error)
      if (isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }

        return (
          error.response?.data ?? {
            ok: false,
            generalErrors: [error.message],
            data: null,
            errors: null
          }
        )
      } else if (error instanceof Error) {
        return { ok: false, generalErrors: [error.message], data: null, errors: null }
      }

      return {
        ok: false,
        generalErrors: ['Ha ocurrido un error inesperado'],
        data: null,
        errors: null
      }
    }
  }
}
