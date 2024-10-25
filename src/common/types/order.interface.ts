export interface Order {
  orderId: string
  tenantId: string
  name: string
  phoneNumber: string
  email: string | null
  createdAt: Date
  userId: string | null
  orderNotes: string | null
  deliveryType: string
  deliveryAddress: string | null
  deliveryDate: Date | null
  deliveryNotes: string | null
  status: string
  total: string
  details: OrderDetail[] | null
}

interface OrderDetail {
  orderDetailId: number
  orderId: string
  productId: number
  productName: string
  image: string
  discountCode: string | null
  discountAmount: number | null
  quantity: number
  productPrice: null
  options: DetailOptionDto[] | null
}

interface DetailOptionDto {
  orderDetailOptionId: number
  orderDetailId: number
  optionId: number
  productName: string
  quantity: number
  productPrice: number
}
