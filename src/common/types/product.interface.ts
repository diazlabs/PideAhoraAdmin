export interface CreateProductRequest {
  tenantId: string
  productName: string
  productDescription?: string
  productType: string
  productPrice: number
  visible: boolean
  choices: ChoiceDto[]
  image?: File
}

interface ChoiceDto {
  productChoiceId: number
  choice: string
  quantity: number
  required: boolean
  visible: boolean
  options: ChoiceOptionDto[]
}

interface ChoiceOptionDto {
  choiceOptionId: number
  optionPrice: number
  visible: boolean
  productId: number
}

export interface CreateProductResponse {}

export interface UpdateProductRequest {
  productId: number
  tenantId: string
  productName: string
  productDescription?: string
  productPrice: number
  visible: boolean
  choices: ChoiceDto[]
}

export interface UpdateProductResponse {}

export interface ProductById {
  productId: number
  productName: string
  productDescription?: string
  productPrice: number
  productType: string
  visible: boolean
  image: string
  choices: ChoiceDto[]
}

export interface Product {
  productId: number
  productName: string
  productDescription?: string
  productType: string
  productPrice: number
  visible: boolean
  image: string
}

export interface ProductType {
  label: string
  type: string
}
