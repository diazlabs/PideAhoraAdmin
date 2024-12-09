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

export interface ArrangeOrder {
  tenantId: string
  tenantTemplateId: string
  sections: ArrangeOrderSection[]
}

interface ArrangeOrderSection {
  templateSectionId: number
  order: number
}

export interface TemplateById {
  tenantId: string
  tenantTemplateId: string
  name: string
  header: string
  description: string
  logo: string
  sections: TempalteSectionDto[]
}

export interface TempalteSectionDto {
  tenantTemplateId: string
  order: number
  templateSectionId: number
  sectionName: string
  sectionDescription: string
}
