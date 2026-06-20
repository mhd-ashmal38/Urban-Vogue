import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define the User type (matches your backend User model)
interface User {
  id: string
  name: string
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Define the AuthStore interface
interface AuthStore {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  setToken: (accessToken: string, refreshToken: string) => void
  logout: () => void
  setUser: (user: User) => void
}

// Create the auth store with persistence
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      // Set user and both tokens after successful login/register
      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          token: accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      // Update tokens only (called after token refresh)
      setToken: (accessToken, refreshToken) =>
        set({
          token: accessToken,
          refreshToken,
        }),

      // Clear everything on logout
      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      // Update user data (e.g., after profile update)
      setUser: (user) =>
        set({
          user,
        }),
    }),
    {
      name: 'auth-storage', // Key for localStorage
    }
  )
)
