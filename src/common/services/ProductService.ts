import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import type { ApiResponse } from '../types/api.interface'
import type {
  CreateProductRequest,
  CreateProductResponse,
  Product,
  ProductById,
  ProductType,
  UpdateProductRequest,
  UpdateProductResponse
} from '../types/product.interface'

export default class ProductService {
  static async Create(product: CreateProductRequest): Promise<ApiResponse<CreateProductResponse>> {
    try {
      const request = new FormData()

      request.append('choices', JSON.stringify(product.choices))
      request.append('productName', product.productName)
      request.append('productPrice', product.productPrice.toString())
      request.append('visible', `${product.visible}`)
      request.append('productType', `${product.productType}`)
      if (product.image) {
        request.append('image', product.image)
      }

      if (product.productDescription)
        request.append('productDescription', product.productDescription)

      const response = await AxiosInstance.post<ApiResponse<CreateProductResponse>>(
        `/products/${product.tenantId}`,
        request
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async Update(product: UpdateProductRequest): Promise<ApiResponse<UpdateProductResponse>> {
    try {
      const request = new FormData()

      request.append('choices', JSON.stringify(product.choices))
      request.append('productName', product.productName)
      request.append('productPrice', product.productPrice.toString())
      request.append('visible', `${product.visible}`)

      if (product.productDescription)
        request.append('productDescription', product.productDescription)

      if (product.image) request.append('image', product.image)

      const response = await AxiosInstance.put<ApiResponse<UpdateProductResponse>>(
        `/products/${product.tenantId}/${product.productId}`,
        request
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async Delete(tenantId: string, productId: number) {
    try {
      const response = await AxiosInstance.delete<ApiResponse<object>>(
        `/products/${tenantId}/${productId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetById(tenantId: string, productId: number): Promise<ApiResponse<ProductById>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<ProductById>>(
        `/products/${tenantId}/${productId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetAll(tenantId: string): Promise<ApiResponse<Product[]>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<Product[]>>(`/products/${tenantId}`)

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetAllExtra(tenantId: string): Promise<ApiResponse<Product[]>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<Product[]>>(
        `/products/${tenantId}/extras`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetProductTypes(): Promise<ApiResponse<ProductType[]>> {
    try {
      const response = await AxiosInstance.get<ApiResponse<ProductType[]>>(`/products/types`)

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }
}
