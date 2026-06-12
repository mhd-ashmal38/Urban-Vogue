import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import { authApi } from '../services/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { P, Small } from '../components/ui/typography'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
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

    try {
      await authApi.forgotPassword({ email })
      console.log('Forgot password email sent')
      toast.success('Password reset email sent! Check your inbox.')
    } catch (err: unknown) {
      console.error('Forgot password error:', err)
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <Card className="max-w-md w-[90%] max-h-[90vh] shadow-xl">
        <CardHeader className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-t-xl">
          <CardTitle className="text-3xl font-bold text-center text-white">Forgot Password</CardTitle>
          <CardDescription className="text-center text-blue-100 mt-2">
            Enter your email to receive a password reset link
          </CardDescription>
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

            {/* Submit Button */}
            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-300"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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
