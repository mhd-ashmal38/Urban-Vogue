import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, ShoppingBag, FolderOpen, Package, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { Button } from './ui/button'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/products', label: 'Products', icon: ShoppingBag },
  { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { path: '/admin/orders', label: 'Orders', icon: Package },
]

export default function AdminSidebar() {
  const location = useLocation()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-purple-600">Urban Vogue</h1>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
