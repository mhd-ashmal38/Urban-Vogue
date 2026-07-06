import { Package, ShoppingBag, Users, FolderOpen, Search, ShoppingCart, FileText } from 'lucide-react'

interface EmptyStateProps {
  type: 'orders' | 'products' | 'users' | 'categories' | 'cart' | 'search' | 'generic'
  title?: string
  description?: string
  action?: React.ReactNode
}

const emptyStateConfig = {
  orders: {
    icon: <Package className="w-24 h-24 text-purple-300" />,
    defaultTitle: 'No orders yet',
    defaultDescription: 'Orders will appear here when customers make purchases',
  },
  products: {
    icon: <ShoppingBag className="w-24 h-24 text-purple-300" />,
    defaultTitle: 'No products found',
    defaultDescription: 'Add some products to get started',
  },
  users: {
    icon: <Users className="w-24 h-24 text-purple-300" />,
    defaultTitle: 'No users yet',
    defaultDescription: 'Users will appear here when they register',
  },
  categories: {
    icon: <FolderOpen className="w-24 h-24 text-purple-300" />,
    defaultTitle: 'No categories found',
    defaultDescription: 'Create categories to organize your products',
  },
  cart: {
    icon: <ShoppingCart className="w-24 h-24 text-purple-300" />,
    defaultTitle: 'Your cart is empty',
    defaultDescription: 'Add some products to checkout',
  },
  search: {
    icon: <Search className="w-24 h-24 text-purple-300" />,
    defaultTitle: 'No results found',
    defaultDescription: 'Try adjusting your search or filters',
  },
  generic: {
    icon: <FileText className="w-24 h-24 text-purple-300" />,
    defaultTitle: 'Nothing to show',
    defaultDescription: 'Items will appear here',
  },
}

export default function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const config = emptyStateConfig[type]

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="bg-purple-50 rounded-full p-8">
            {config.icon}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {title || config.defaultTitle}
        </h2>
        <p className="text-gray-600 mb-6">
          {description || config.defaultDescription}
        </p>
        {action && <div className="flex justify-center">{action}</div>}
      </div>
    </div>
  )
}
