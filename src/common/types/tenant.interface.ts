import type { Audit } from './api.interface'

export interface CreateTenantRequest {
  name: string
  pageTitle: string
  path: string
  description: string
  category: string
}

export interface CreateTenantResponse {
  name: string
  pageTitle: string
  path: string
  description: string
  category: string
  logo: string
}

export interface UpdateTenantRequest {
  tenantId: string
  name: string
  pageTitle: string
  path: string
  description: string
  category: string
}

export interface UpdateTenantResponse {}

export interface TenantById extends Audit {
  name: string
  pageTitle: string
  path: string
  description: string
  category: string
  logo: string
  userId: string
  enabled: boolean
}

export interface Tenants {
  tenants: TenantById[]
}
