import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import type { ApiResponse } from '../types/api.interface'
import type {
  DeleteSectionRequest,
  SectionById,
  Sections,
  UpdateSectionRequest,
  UpdateSectionResponse
} from '../types/section.interface'

export default class SectionService {
  static async Update(section: UpdateSectionRequest): Promise<ApiResponse<UpdateSectionResponse>> {
    try {
      const response = await AxiosInstance.put<ApiResponse<UpdateSectionResponse>>(
        `/sections/${section.tenantId}/${section.templateSectionId}`,
        section
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async Delete({
    templateSectionId,
    tenantId,
    tenantTemplateId
  }: DeleteSectionRequest): Promise<ApiResponse<object>> {
    try {
      const response = await AxiosInstance.delete<ApiResponse<object>>(
        `/sections/${tenantId}/${tenantTemplateId}?templateSectionId=${templateSectionId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetById(
    tenantId: string,
    tenantTemplateId: string,
    templateSectionId: number
  ): Promise<ApiResponse<SectionById>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<SectionById>>(
        `/sections/${tenantId}/${tenantTemplateId}/${templateSectionId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetAll(tenantId: string) {
    try {
      const response = await AxiosInstance.get<ApiResponse<Sections>>(`/sections/${tenantId}`)

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }
}
