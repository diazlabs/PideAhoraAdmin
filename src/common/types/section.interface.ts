export interface CreateSectionRequest {
  tenantId: string
  tenantTemplateId: string
  sectionVariantId: number
  order: number
  visible: boolean
  products: CreateSectionProductsDto[]
}

interface CreateSectionProductsDto {
  productId: number
  order: number
}

export interface CreateSectionResponse {}

export interface UpdateSectionRequest {
  tenantId: string
  templateSectionId: number
  tenantTemplateId: string
  sectionVariantId: number
  order: number
  visible: boolean
  products: UpdateSectionProductsDto[]
}

interface UpdateSectionProductsDto {
  productId: number
  order: number
}

export interface UpdateSectionResponse {}

interface Section {
  order: number
  visible: boolean
  sectionVariantId: number
}

export interface Sections {
  sections: Section[]
}
