import api from './api'

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  size?: string | null
  color?: string | null
  product: {
    id: string
    name: string
    price: number
    images: string[]
  }
}

export interface Order {
  id: string
  userId: string
  total: number
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  shippingAddress: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string | null
    email: string
  }
}

export interface CreateOrderDto {
  shippingAddress: string
}

export interface UpdateOrderDto {
  status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
}

// Order API methods
export const orderApi = {
  // Create order from cart
  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    const response = await api.post<Order>('/orders', data)
    return response.data
  },

  // Get current user's orders
  getUserOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders')
    return response.data
  },

  // Get specific order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${orderId}`)
    return response.data
  },

  // Update order status (admin only)
  updateOrderStatus: async (
    orderId: string,
    data: UpdateOrderDto,
  ): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${orderId}`, data)
    return response.data
  },

  // Get all orders (admin only)
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders/admin/all')
    return response.data
  },
}
