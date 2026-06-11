import api from './api'

// Define types matching your backend DTOs
interface LoginDto {
  email: string
  password: string
}

interface RegisterDto {
  name: string
  email: string
  password: string
}

interface ForgotPasswordDto {
  email: string
}

interface ResetPasswordDto {
  token: string
  password: string
}

interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  token: string
}

interface MessageResponse {
  message: string
}

// Auth API methods
export const authApi = {
  // Login user
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  // Register new user
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  // Get current user profile
  getProfile: async (): Promise<{
    id: string
    name: string
    email: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }> => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Request password reset
  forgotPassword: async (data: ForgotPasswordDto): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      '/auth/forgot-password',
      data
    )
    return response.data
  },

  // Reset password with token
  resetPassword: async (data: ResetPasswordDto): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/reset-password', data)
    return response.data
  },
}
