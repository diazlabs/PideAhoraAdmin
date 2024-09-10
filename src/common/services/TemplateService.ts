import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import type { ApiResponse } from '../types/api.interface'
import type {
  CreateTemplateRequest,
  CreateTemplateResponse,
  TemplateById,
  Templates,
  UpdateTemplateRequest,
  UpdateTemplateResponse
} from '../types/template.interface'

export default class TemplateService {
  static async Create(
    template: CreateTemplateRequest
  ): Promise<ApiResponse<CreateTemplateResponse>> {
    try {
      const request = new FormData()

      request.append('description', template.description)
      request.append('header', template.header)
      request.append('name', template.name)

      if (template.logo) {
        request.append('logo', template.logo)
      }

      const response = await AxiosInstance.post<ApiResponse<CreateTemplateResponse>>(
        `/admin/templates/${template.tenantId}`,
        request
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async Update(
    template: UpdateTemplateRequest,
    logo?: File
  ): Promise<ApiResponse<UpdateTemplateResponse>> {
    try {
      const request = new FormData()

      request.append('description', template.description)
      request.append('header', template.header)

      if (logo) request.append('logo', logo)

      const response = await AxiosInstance.put<ApiResponse<UpdateTemplateResponse>>(
        `/admin/tenants/${template.tenantId}/${template.tenantTemplateId}`,
        request
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async Delete(tenantId: string, tenantTemplateId: string) {
    try {
      const response = await AxiosInstance.delete<ApiResponse<object>>(
        `/admin/tenants/${tenantId}/${tenantTemplateId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetById(
    tenantId: string,
    tenantTemplateId: string
  ): Promise<ApiResponse<TemplateById>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<TemplateById>>(
        `/admin/tenants/${tenantId}/${tenantTemplateId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetAll(tenantId: string) {
    try {
      const response = await AxiosInstance.get<ApiResponse<Templates>>(`/admin/tenants/${tenantId}`)

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }
}
