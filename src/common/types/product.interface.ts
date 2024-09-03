export interface CreateProductRequest {
  tenantId: string
  productName: string
  productDescription?: string
  productPrice: number
  visible: boolean
  choices: ChoiceDto[]
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
  visible: boolean
  image: string
  choices: ChoiceDto[]
}

interface Product {
  productId: number
  productName: string
  productDescription?: string
  productPrice: number
  visible: boolean
  image: string
}

export interface Products {
  products: Product[]
}
