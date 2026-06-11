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
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
}

// Create the auth store with persistence
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Set user and token after successful login/register
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      // Clear user and token on logout
      logout: () =>
        set({
          user: null,
          token: null,
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
