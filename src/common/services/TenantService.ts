import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import type { ApiResponse } from '../types/api.interface'
import type {
  CreateTenantRequest,
  CreateTenantResponse,
  TenantById,
  TenantCategory,
  Tenants,
  UpdateTenantRequest,
  UpdateTenantResponse
} from '../types/tenant.interface'

export default class TenantService {
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

  static async Update(tenant: UpdateTenantRequest): Promise<ApiResponse<UpdateTenantResponse>> {
    try {
      const request = new FormData()

      request.append('name', tenant.name)
      request.append('pageTitle', tenant.pageTitle)
      request.append('path', tenant.path)
      request.append('description', tenant.description)
      request.append('category', tenant.category)

      if (tenant.logo) request.append('logo', tenant.logo)

      const response = await AxiosInstance.put<ApiResponse<UpdateTenantResponse>>(
        `/admin/tenants/${tenant.tenantId}`,
        request
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async Delete(tenantId: string) {
    try {
      const response = await AxiosInstance.delete<ApiResponse<object>>(`/admin/tenants/${tenantId}`)

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetById(tenantId: string): Promise<ApiResponse<TenantById>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<TenantById>>(
        `/admin/tenants/${tenantId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetAll(): Promise<ApiResponse<Tenants[]>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<Tenants[]>>(`/admin/tenants/`)

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetCategories(): Promise<ApiResponse<TenantCategory[]>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<TenantCategory[]>>(`/tenants/categories`)

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }
}
