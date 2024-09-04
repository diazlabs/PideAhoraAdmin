import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import { type ApiResponse } from '../types/api.interface'
import type { Orders } from '../types/order.interface'

export default class OrderService {
  static async GetAll(tenantId: string): Promise<ApiResponse<Orders>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<Orders>>(`/orders/${tenantId}`)

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }
}