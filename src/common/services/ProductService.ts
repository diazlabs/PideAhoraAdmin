import AxiosInstance from './AxiosInstance'
import handleHttpError from './HandleHttpError'

import type { ApiResponse } from '../types/api.interface'
import type {
  CreateProductRequest,
  CreateProductResponse,
  ProductById,
  Products,
  UpdateProductRequest,
  UpdateProductResponse
} from '../types/product.interface'

export default class ProductService {
  static async Create(
    product: CreateProductRequest,
    image: File
  ): Promise<ApiResponse<CreateProductResponse>> {
    try {
      const request = new FormData()

      request.append('choices', JSON.stringify(product.choices))
      request.append('productName', product.productName)
      request.append('productPrice', product.productPrice.toString())
      request.append('visible', `${product.visible}`)
      request.append('image', image)

      if (product.productDescription)
        request.append('productDescription', product.productDescription)

      const response = await AxiosInstance.post<ApiResponse<CreateProductResponse>>(
        '/products',
        request
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async Update(
    product: UpdateProductRequest,
    iamge?: File
  ): Promise<ApiResponse<UpdateProductResponse>> {
    try {
      const request = new FormData()

      request.append('choices', JSON.stringify(product.choices))
      request.append('productName', product.productName)
      request.append('productPrice', product.productPrice.toString())
      request.append('visible', `${product.visible}`)

      if (product.productDescription)
        request.append('productDescription', product.productDescription)

      if (iamge) request.append('logo', iamge)

      const response = await AxiosInstance.put<ApiResponse<UpdateProductResponse>>(
        `/admin/tenants/${product.tenantId}/${product.productId}`,
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
        `/admin/tenants/${tenantId}/${productId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetById(tenantId: string, productId: number) {
    try {
      const response = await AxiosInstance.get<ApiResponse<ProductById>>(
        `/admin/tenants/${tenantId}/${productId}`
      )

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }

  static async GetAll() {
    try {
      const response = await AxiosInstance.get<ApiResponse<Products>>(`/admin/tenants/`)

      return response.data
    } catch (error) {
      return handleHttpError(error)
    }
  }
}
