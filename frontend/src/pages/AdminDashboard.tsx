import { Shield, Users, ShoppingBag, BarChart3 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import AdminLayout from '../components/AdminLayout'

export default function AdminDashboard() {
  const { user } = useAuthStore()

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome, {user?.name || 'Admin'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">567</p>
              </div>
              <ShoppingBag className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$12,345</p>
              </div>
              <BarChart3 className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Admin Role</p>
                <p className="text-2xl font-bold text-gray-900">Active</p>
              </div>
              <Shield className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
