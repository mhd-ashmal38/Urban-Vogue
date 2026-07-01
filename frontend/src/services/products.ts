import api from './api'

// Define types matching your backend DTOs
export interface Category {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  images: string[]
  categoryId: string
  category: Category
  createdAt: string
  updatedAt: string
}

interface CreateCategoryDto {
  name: string
  description?: string
}

interface UpdateCategoryDto {
  name?: string
  description?: string
}

interface CreateProductDto {
  name: string
  description?: string
  price: number
  stock: number
  categoryId: string
  images?: string[]
}

interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  stock?: number
  categoryId?: string
  images?: string[]
}

interface DeleteResponse {
  message: string
  category?: Category
  product?: Product
}

interface UploadResponse {
  message: string
  images: string[]
}

interface DeleteImageResponse {
  message: string
  filename: string
}

interface BulkDeleteResponse {
  message: string
  count: number
}

// Categories API methods
export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories')
    return response.data
  },

  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`)
    return response.data
  },

  // Create category (admin only)
  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<Category>('/categories', data)
    return response.data
  },

  // Update category (admin only)
  update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    const response = await api.patch<Category>(`/categories/${id}`, data)
    return response.data
  },

  // Delete category (admin only)
  delete: async (id: string): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(`/categories/${id}`)
    return response.data
  },
}

// Products API methods
export const productsApi = {
  // Get all products (optional category filter)
  getAll: async (categoryId?: string): Promise<Product[]> => {
    const params = categoryId ? { categoryId } : {}
    const response = await api.get<Product[]>('/products', { params })
    return response.data
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  },

  // Search products by name
  search: async (query: string): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/search', {
      params: { q: query },
    })
    return response.data
  },

  // Create product (admin only)
  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post<Product>('/products', data)
    return response.data
  },

  // Update product (admin only)
  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}`, data)
    return response.data
  },

  // Delete product (admin only)
  delete: async (id: string): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(`/products/${id}`)
    return response.data
  },

  // Upload product images (admin only)
  uploadImages: async (files: File[]): Promise<UploadResponse> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images', file)
    })

    const response = await api.post<UploadResponse>('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete individual image (admin only)
  deleteImage: async (imageUrl: string): Promise<DeleteImageResponse> => {
    const response = await api.delete<DeleteImageResponse>('/products/delete-image', {
      data: { imageUrl },
    })
    return response.data
  },

  // Bulk delete products (admin only)
  bulkDelete: async (ids: string[]): Promise<BulkDeleteResponse> => {
    const response = await api.delete<BulkDeleteResponse>('/products/bulk-delete', {
      data: { ids },
    })
    return response.data
  },
}
