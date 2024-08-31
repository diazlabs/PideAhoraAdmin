import axios from 'axios'
import AxiosInstance from './AxiosInstance'
import type { ApiResponse } from '../types/api.interface'
import type { CreateTenant } from '../types/tenant.interface'

export default class TenantService {
  static async Create(meidicne: CreateTenant): Promise<ApiResponse<string>> {
    try {
      const response = await AxiosInstance.post<ApiResponse<string>>('/medicine', meidicne)

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.data
      } else {
        const response: ApiResponse<string> = {
          data: '',
          message: 'An error has ocurred',
          ok: false
        }
        return response
      }
    }
  }
}
