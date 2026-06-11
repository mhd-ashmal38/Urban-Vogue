import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { authApi } from '../services/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({})

  const validateForm = () => {
    const errors: { email?: string } = {}

    if (!email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!validateForm()) {
      return
    }

    console.log('Forgot password request for:', email)
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await authApi.forgotPassword({ email })
      console.log('Forgot password email sent')
      setSuccess(true)
    } catch (err: unknown) {
      console.error('Forgot password error:', err)
      const error = err as { response?: { data?: { message?: string } } }
      setError(
        error.response?.data?.message || 'Failed to send reset email. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Forgot Password</h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your email to receive a password reset link
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Password reset email sent! Check your inbox.
          </div>
        )}

        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter your email"
                disabled={success}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={isLoading || success}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending...' : success ? 'Email Sent' : 'Send Reset Link'}
          </button>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
