export interface CreateTemplateRequest {
  tenantId: string
  name: string
  logo?: File
  header: string
  description: string
}

export interface CreateTemplateResponse {}

export interface UpdateTemplateRequest {
  tenantId: string
  header: string
  description: string
  tenantTemplateId: string
  logo?: File
  name: string
}

export interface UpdateTemplateResponse {}

export interface TemplateById {
  tenantId: string
  tenantTemplateId: string
  name: string
  header: string
  description: string
  logo: string
}
