export interface CreateTemplateRequest {
  tenantId: string
  header: string
  description: string
}

export interface CreateTemplateResponse {}

export interface UpdateTemplateRequest {
  tenantId: string
  header: string
  description: string
  tenantTemplateId: string
}

export interface UpdateTemplateResponse {}

export interface TemplateById {}

export interface Templates {
  templates: TemplateById[]
}
