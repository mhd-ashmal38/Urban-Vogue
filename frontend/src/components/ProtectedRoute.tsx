import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'USER' | 'ADMIN'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If a specific role is required, check if user has it
  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect to home if user doesn't have required role
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
