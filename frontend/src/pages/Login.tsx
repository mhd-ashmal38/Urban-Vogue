import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { authApi } from '../services/auth'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { P, Small } from '../components/ui/typography'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {}

    if (!email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
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

    console.log('Login attempt with:', email)
    setIsLoading(true)

    try {
      const response = await authApi.login({ email, password })
      console.log('Login successful:', response)
      setAuth(response.user, response.accessToken, response.refreshToken)
      toast.success('Login successful!')

      // Redirect based on role
      if (response.user.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else {
        navigate('/home')
      }
    } catch (err: unknown) {
      console.error('Login error:', err)
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <Card className="max-w-md w-[90%] max-h-[90vh] shadow-xl">
        <CardHeader className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-t-xl">
          <CardTitle className="text-3xl font-bold text-center text-white">Welcome Back</CardTitle>
          <CardDescription className="text-center text-blue-100 mt-2">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-1 w-full py-6">

          <div className="space-y-5 w-full">
            {/* Email Field */}
            <div className="w-full">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                placeholder="Enter your email"
              />
              {fieldErrors.email && (
                <Small className="text-red-500 mt-1">{fieldErrors.email}</Small>
              )}
            </div>

            {/* Password Field */}
            <div className="w-full">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                placeholder="Enter your password"
              />
              {fieldErrors.password && (
                <Small className="text-red-500 mt-1">{fieldErrors.password}</Small>
              )}
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-300"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>

          {/* Register Link */}
          <P className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
              Register
            </Link>
          </P>
        </CardContent>
      </Card>
    </div>
  )
}
