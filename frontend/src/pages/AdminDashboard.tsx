import { Shield, Users, ShoppingBag, BarChart3 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function AdminDashboard() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-linear-to-r from-purple-600 to-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-purple-100 mt-2">Welcome, {user?.name || 'Admin'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
              Manage Users
            </button>
            <button className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
              Manage Products
            </button>
            <button className="bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors">
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
