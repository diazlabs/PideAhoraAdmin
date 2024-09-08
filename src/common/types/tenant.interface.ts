import type { Audit } from './api.interface'

export interface CreateTenantRequest {
  name: string
  pageTitle: string
  path: string
  description: string
  category: string
  logo: File
}

export interface CreateTenantResponse {
  tenantId: string
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
  logo?: File
}

export interface UpdateTenantResponse {}

export interface TenantById extends Audit {
  tenantId: string
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
  tenantId: string
  userId: string
  path: string
  name: string
  pageTitle: string
  description: string
  logo: string
  category: string
}

export interface TenantCategory {
  name: string
  code: string
}
