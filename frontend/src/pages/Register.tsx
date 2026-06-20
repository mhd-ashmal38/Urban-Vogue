import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { authApi } from '../services/auth'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { P, Small } from '../components/ui/typography'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'

// Zod schema for register validation
const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number'
      ),
  })
  .refine((data) => data.email === data.email, {
    message: 'Email must be valid',
    path: ['email'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      const response = await authApi.register(data)
      setAuth(response.user, response.accessToken, response.refreshToken)
      toast.success('Registration successful!')
      navigate('/profile')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(onSubmit)(e)
  }

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <Card className="max-w-md w-[90%] max-h-[90vh] shadow-xl">
        <CardHeader className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-t-xl">
          <CardTitle className="text-3xl font-bold text-center text-white">Create Account</CardTitle>
          <CardDescription className="text-center text-blue-100 mt-2">Join us today</CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-1 w-full py-6">

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="w-full">
              <Label>Name</Label>
              <Input
                type="text"
                {...register('name')}
                icon={<User className="w-5 h-5 text-gray-400" />}
                placeholder="Enter your name"
              />
              {errors.name && (
                <Small className="text-red-500 mt-1">{errors.name.message}</Small>
              )}
            </div>

            {/* Email Field */}
            <div className="w-full">
              <Label>Email</Label>
              <Input
                type="email"
                {...register('email')}
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                placeholder="Enter your email"
              />
              {errors.email && (
                <Small className="text-red-500 mt-1">{errors.email.message}</Small>
              )}
            </div>

            {/* Password Field */}
            <div className="w-full">
              <Label>Password</Label>
              <Input
                type="password"
                {...register('password')}
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                placeholder="Enter your password"
              />
              {errors.password && (
                <Small className="text-red-500 mt-1">
                  {errors.password.message}
                </Small>
              )}
              <Small className="text-xs text-gray-500 mt-1">
                Must contain uppercase, lowercase, and number
              </Small>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-300"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          {/* Login Link */}
          <P className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
              Login
            </Link>
          </P>
        </CardContent>
      </Card>
    </div>
  )
}
