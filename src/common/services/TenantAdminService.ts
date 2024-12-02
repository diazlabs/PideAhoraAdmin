import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import type { ApiResponse } from '../types/api.interface'
import type { CreateTenantRequest, CreateTenantResponse } from '../types/tenant.interface'

export default class TenantAdminService {
  static async Create(tenant: CreateTenantRequest): Promise<ApiResponse<CreateTenantResponse>> {
    try {
      const request = new FormData()

      request.append('name', tenant.name)
      request.append('pageTitle', tenant.pageTitle)
      request.append('path', tenant.path)
      request.append('description', tenant.description)
      request.append('category', tenant.category)
      request.append('logo', tenant.logo)

      const response = await AxiosInstance.post<ApiResponse<CreateTenantResponse>>(
        '/admin/tenants',
        request
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }
}
