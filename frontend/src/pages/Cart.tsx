import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { Button } from '../components/ui/button'

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore()

  const handleQuantityChange = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity < 1) {
      removeItem(productId, size, color)
    } else {
      updateQuantity(productId, quantity, size, color)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to get started</p>
            <Link to="/products">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({getTotalItems()} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}-${index}`}
                className="bg-white rounded-lg shadow-md p-4 flex gap-4"
              >
                {/* Product Image */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  
                  {/* Variants */}
                  <div className="flex gap-2 mt-1">
                    {item.size && (
                      <span className="text-sm text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                        Size: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Color: {item.color}
                      </span>
                    )}
                  </div>

                  <p className="text-lg font-bold text-purple-600 mt-2">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1, item.size, item.color)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1, item.size, item.color)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{getTotalPrice() >= 50 ? 'Free' : '$5.00'}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>${(getTotalPrice() + (getTotalPrice() >= 50 ? 0 : 5)).toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-3">
                <ArrowRight className="w-5 h-5" />
                Proceed to Checkout
              </Button>

              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Cart
              </Button>

              <div className="mt-4 text-sm text-gray-500 space-y-1">
                <p>• Free shipping on orders over $50</p>
                <p>• 30-day return policy</p>
                <p>• Secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
