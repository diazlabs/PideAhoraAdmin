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
  sectionVariantId: number
  sectionName: string
  sectionDescription: string
  order: number
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
  configName: string
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
  sectionConfigId: string
  sectionConfigName: string
  sectionConfigValue: string
}

export interface Sections {
  sections: Section[]
}
