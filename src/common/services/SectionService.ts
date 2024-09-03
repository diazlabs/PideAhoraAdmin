import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import type { ApiResponse } from '../types/api.interface'
import type {
  CreateSectionRequest,
  CreateSectionResponse,
  Sections,
  UpdateSectionRequest,
  UpdateSectionResponse
} from '../types/section.interface'

export default class SectionService {
  static async Create(section: CreateSectionRequest): Promise<ApiResponse<CreateSectionResponse>> {
    try {
      const response = await AxiosInstance.post<ApiResponse<CreateSectionResponse>>(
        `/admin/templates/${section.tenantId}`,
        section
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async Update(section: UpdateSectionRequest): Promise<ApiResponse<UpdateSectionResponse>> {
    try {
      const response = await AxiosInstance.put<ApiResponse<UpdateSectionResponse>>(
        `/admin/tenants/${section.tenantId}/${section.templateSectionId}`,
        section
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async Delete(tenantId: string, tenantTemplateId: string, templateSectionId: string) {
    try {
      const response = await AxiosInstance.delete<ApiResponse<object>>(
        `/admin/tenants/${tenantId}/${tenantTemplateId}?templateSectionId=${templateSectionId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  /*   static async GetById(tenantId: string, tenantTemplateId: string) {
    try {
      const response = await AxiosInstance.get<ApiResponse<TemplateById>>(
        `/admin/tenants/${tenantId}/${tenantTemplateId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  } */

  static async GetAll(tenantId: string) {
    try {
      const response = await AxiosInstance.get<ApiResponse<Sections>>(`/admin/tenants/${tenantId}`)

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }
}
