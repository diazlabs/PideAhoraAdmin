export interface CreateConfigRequest {
  configName: string
  configValue: string
  enabled: boolean
  visible: boolean
  tenantId: string
  configType: string
}

export interface CreateConfigResponse {}

export interface UpdateConfigRequest {
  configName: string
  configValue: string
  enabled: boolean
  tenantConfigId: string
  tenantId: string
}

export interface UpdateAllConfigRequest {
  configs: UpdateConfig[]
  tenantId: string
}

interface UpdateConfig {
  configValue: string
  enabled: boolean
  configId: string
}

export interface UpdateConfigResponse {}

export interface TenantConfig {
  tenantId: string
  tenantConfigId: string
  configName: string
  configValue: string
  configType: string
  enabled: boolean
}

export interface TenantConfigType {
  type: string
  label: string
}
