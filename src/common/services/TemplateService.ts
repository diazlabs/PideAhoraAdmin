import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import type { ApiResponse } from '../types/api.interface'
import type {
  CreateTemplateRequest,
  CreateTemplateResponse,
  TemplateById,
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
        `/templates/${template.tenantId}`,
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

      request.append('name', template.name)
      request.append('description', template.description)
      request.append('header', template.header)

      if (logo) request.append('logo', logo)

      const response = await AxiosInstance.put<ApiResponse<UpdateTemplateResponse>>(
        `/templates/${template.tenantId}/${template.tenantTemplateId}`,
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
        `/templates/${tenantId}/${tenantTemplateId}`
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
        `/templates/${tenantId}/${tenantTemplateId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetAll(tenantId: string): Promise<ApiResponse<TemplateById[]>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<TemplateById[]>>(
        `/templates/${tenantId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }
}
