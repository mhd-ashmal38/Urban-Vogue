import api from './api'

export interface User {
  id: string
  name: string | null
  email: string
  role: 'USER' | 'ADMIN'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface UpdateUserDto {
  name?: string
  email?: string
  role?: 'USER' | 'ADMIN'
  isActive?: boolean
}

interface DeleteResponse {
  message: string
  user?: User
}

interface BulkDeleteResponse {
  message: string
  count: number
}

// Users API methods (admin only)
export const usersApi = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users')
    return response.data
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  // Update user
  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, data)
    return response.data
  },

  // Delete user
  delete: async (id: string): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(`/users/${id}`)
    return response.data
  },

  // Bulk delete users
  bulkDelete: async (ids: string[]): Promise<BulkDeleteResponse> => {
    const response = await api.delete<BulkDeleteResponse>('/users/bulk-delete', {
      data: { ids },
    })
    return response.data
  },
}
