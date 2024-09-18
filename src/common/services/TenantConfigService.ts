import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import type { ApiResponse } from '../types/api.interface'
import type {
  CreateConfigRequest,
  CreateConfigResponse,
  TenantConfig,
  TenantConfigType,
  UpdateAllConfigRequest,
  UpdateConfigRequest,
  UpdateConfigResponse
} from '../types/tenantConfigs.interface'

export default class TenantConfigService {
  static async Create(config: CreateConfigRequest): Promise<ApiResponse<CreateConfigResponse>> {
    try {
      const response = await AxiosInstance.post<ApiResponse<CreateConfigResponse>>(
        `/tenant-configuration/${config.tenantId}`,
        config
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async Update(config: UpdateConfigRequest): Promise<ApiResponse<UpdateConfigResponse>> {
    try {
      const response = await AxiosInstance.put<ApiResponse<UpdateConfigResponse>>(
        `/tenant-configuration/${config.tenantId}`,
        config
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async UpdateAll(
    request: UpdateAllConfigRequest
  ): Promise<ApiResponse<UpdateConfigResponse>> {
    try {
      const response = await AxiosInstance.put<ApiResponse<UpdateConfigResponse>>(
        `/tenant-configuration/${request.tenantId}/all`,
        request.configs
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async Delete(tenantId: string, configId: string) {
    try {
      const response = await AxiosInstance.delete<ApiResponse<object>>(
        `/tenant-configuration/${tenantId}/?tenantConfigId=${configId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetAll(tenantId: string): Promise<ApiResponse<TenantConfig[]>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<TenantConfig[]>>(
        `/tenant-configuration/${tenantId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetTypes(): Promise<ApiResponse<TenantConfigType[]>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<TenantConfigType[]>>(
        `/tenant-configuration/types`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }
}
