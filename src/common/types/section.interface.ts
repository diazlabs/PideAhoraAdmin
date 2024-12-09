export interface CreateSectionRequest {
  tenantId: string
  tenantTemplateId: string
  sectionName: string
  sectionDescription: string
  visible: boolean
  products: CreateSectionProductsDto[]
  configs: CreateSectionConfigurationsDto[]
}

interface CreateSectionProductsDto {
  productId: number
  order: number
}

interface CreateSectionConfigurationsDto {
  configName: string
  configValue: string
}

export interface CreateSectionResponse {}

export interface UpdateSectionRequest {
  tenantId: string
  templateSectionId: number
  tenantTemplateId: string
  sectionName: string
  sectionDescription: string
  visible: boolean
  products: UpdateSectionProductsDto[]
  configs: UpdateSectionConfigurationsDto[]
}

interface UpdateSectionProductsDto {
  productId: number
  order: number
}

interface UpdateSectionConfigurationsDto {
  sectionConfigId: number
  configValue: string
}

export interface UpdateSectionResponse {}

interface Section {
  order: number
  visible: boolean
  sectionVariantId: number
  sectionName: string
  sectionDescription: string
}

export interface SectionById {
  tenantId: string
  tenantTemplateId: string
  templateSectionId: number
  sectionDescription: string
  sectionName: string
  visible: boolean
  products: SectionProduct[]
  configurations: SectionConfiguration[]
}

interface SectionProduct {
  sectionProductId: number
  productId: number
  productName: string
  image?: string
  order: number
}

interface SectionConfiguration {
  sectionConfigId: number
  sectionConfigName: string
  sectionConfigValue: string
}

export interface Sections {
  sections: Section[]
}

export interface DeleteSectionRequest {
  tenantTemplateId: string
  templateSectionId: number
  tenantId: string
}
