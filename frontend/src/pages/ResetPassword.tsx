import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'
import { authApi } from '../services/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { P, Small } from '../components/ui/typography'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({})

  const validateForm = () => {
    const errors: { password?: string; confirmPassword?: string } = {}

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!token) {
      toast.error('Invalid or missing reset token. Please request a new password reset.')
      return
    }

    if (!validateForm()) {
      return
    }

    console.log('Reset password request')
    setIsLoading(true)

    try {
      await authApi.resetPassword({ token, password })
      console.log('Password reset successful')
      toast.success('Password reset successful! Redirecting to login...')
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err: unknown) {
      console.error('Reset password error:', err)
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <Card className="max-w-md w-[90%] max-h-[90vh] shadow-xl text-center">
          <CardContent className="py-8">
            <P className="text-gray-600">Invalid or missing reset token.</P>
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 font-semibold mt-4 inline-block">
              Request a new password reset
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="max-w-md w-[90%] max-h-[90vh] shadow-xl">
        <CardHeader className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-t-xl">
          <CardTitle className="text-3xl font-bold text-center text-white">Reset Password</CardTitle>
          <CardDescription className="text-center text-blue-100 mt-2">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-1 w-full py-6">

          <div className="space-y-5 w-full">
            {/* Password Field */}
            <div className="w-full">
              <Label>New Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                placeholder="Enter new password"
                disabled={!token}
              />
              {fieldErrors.password && (
                <Small className="text-red-500 mt-1">{fieldErrors.password}</Small>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="w-full">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                placeholder="Confirm new password"
                disabled={!token}
              />
              {fieldErrors.confirmPassword && (
                <Small className="text-red-500 mt-1">{fieldErrors.confirmPassword}</Small>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={onSubmit}
              disabled={isLoading || !token}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-300"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>

          {/* Back to Login */}
          <P className="text-center mt-6">
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
              Back to Login
            </Link>
          </P>
        </CardContent>
      </Card>
    </div>
  )
}
