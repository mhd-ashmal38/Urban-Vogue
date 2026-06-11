import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:3000', // Your NestJS backend URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
