import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, LogOut, AlertCircle, Loader2 } from 'lucide-react'
import { authApi } from '../services/auth'
import { useAuthStore } from '../store/authStore'

export default function Profile() {
  const navigate = useNavigate()
  const { user, token, logout } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!token) {
      navigate('/login')
      return
    }

    // Fetch fresh user data from API
    const fetchProfile = async () => {
      try {
        const userData = await authApi.getProfile()
        useAuthStore.getState().setUser(userData)
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } }
        setError(
          error.response?.data?.message || 'Failed to load profile'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
          <Link
            to="/"
            className="block text-center text-blue-500 hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full">
            <User className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8">Profile</h1>

        {user && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <p className="text-gray-900 font-medium">{user.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <p className="text-gray-900 font-medium">
                {user.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <p className="text-gray-900 font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full mt-8 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>

        <div className="text-center mt-4">
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
