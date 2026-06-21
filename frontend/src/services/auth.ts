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

interface AuthUser {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AuthResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
  refreshTokenExpiry: string
}

interface RefreshResponse {
  accessToken: string
  refreshToken: string
  refreshTokenExpiry: string
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
  getProfile: async (): Promise<AuthUser> => {
    const response = await api.get<AuthUser>('/auth/profile')
    return response.data
  },

  // Refresh access token using refresh token
  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await api.post<RefreshResponse>('/auth/refresh', { refreshToken })
    return response.data
  },

  // Logout - invalidates refresh token in DB
  logout: async (): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/logout')
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
