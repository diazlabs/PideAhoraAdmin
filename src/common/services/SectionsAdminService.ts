import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import type { ApiResponse } from '../types/api.interface'
import type { CreateSectionRequest, CreateSectionResponse } from '../types/section.interface'

export default class SectionAdminService {
  static async Create(section: CreateSectionRequest): Promise<ApiResponse<CreateSectionResponse>> {
    try {
      const response = await AxiosInstance.post<ApiResponse<CreateSectionResponse>>(
        `/sections/${section.tenantId}`,
        section
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }
}
