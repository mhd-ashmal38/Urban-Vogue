import api from './api'

export interface Address {
  id: string
  userId: string
  fullName: string
  streetAddress: string
  apartment?: string | null
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAddressDto {
  fullName: string
  streetAddress: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isPrimary?: boolean
}

export interface UpdateAddressDto {
  fullName?: string
  streetAddress?: string
  apartment?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  phone?: string
  isPrimary?: boolean
}

export const addressApi = {
  // Create a new address
  createAddress: async (data: CreateAddressDto): Promise<Address> => {
    const response = await api.post<Address>('/addresses', data)
    return response.data
  },

  // Get all user addresses
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get<Address[]>('/addresses')
    return response.data
  },

  // Get primary address
  getPrimaryAddress: async (): Promise<Address | null> => {
    try {
      const response = await api.get<Address>('/addresses/primary')
      return response.data
    } catch {
      return null
    }
  },

  // Get specific address by ID
  getAddressById: async (id: string): Promise<Address> => {
    const response = await api.get<Address>(`/addresses/${id}`)
    return response.data
  },

  // Update an address
  updateAddress: async (id: string, data: UpdateAddressDto): Promise<Address> => {
    const response = await api.put<Address>(`/addresses/${id}`, data)
    return response.data
  },

  // Set address as primary
  setPrimaryAddress: async (id: string): Promise<Address> => {
    const response = await api.patch<Address>(`/addresses/${id}/primary`)
    return response.data
  },

  // Delete an address
  deleteAddress: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/addresses/${id}`)
    return response.data
  },
}
