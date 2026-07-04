import api from './api'

export interface CartItem {
  id?: string
  productId: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image?: string | null
}

export interface Cart {
  id: string
  items: CartItem[]
  total: number
}

interface AddItemDto {
  productId: string
  quantity: number
  size?: string
  color?: string
}

interface UpdateItemDto {
  quantity?: number
}

// Cart API methods
export const cartApi = {
  // Get current user's cart
  getCart: async (): Promise<Cart> => {
    const response = await api.get<Cart>('/cart')
    return response.data
  },

  // Add item to cart
  addItem: async (data: AddItemDto): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/items', data)
    return response.data
  },

  // Update item quantity
  updateItem: async (itemId: string, data: UpdateItemDto): Promise<Cart> => {
    const response = await api.patch<Cart>(`/cart/items/${itemId}`, data)
    return response.data
  },

  // Remove item from cart
  removeItem: async (itemId: string): Promise<Cart> => {
    const response = await api.delete<Cart>(`/cart/items/${itemId}`)
    return response.data
  },

  // Clear cart
  clearCart: async (): Promise<Cart> => {
    const response = await api.delete<Cart>('/cart')
    return response.data
  },

  // Merge guest cart with user cart
  mergeCart: async (guestItems: CartItem[]): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/merge', { items: guestItems })
    return response.data
  },
}
