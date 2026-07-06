import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Package, MapPin, ArrowLeft, User, Calendar, DollarSign } from 'lucide-react'
import { orderApi, type Order } from '../services/orders'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const statusBorderColors: Record<string, string> = {
  PENDING: 'border-l-yellow-600',
  PROCESSING: 'border-l-blue-600',
  SHIPPED: 'border-l-purple-600',
  DELIVERED: 'border-l-green-600',
  CANCELLED: 'border-l-red-600',
}

interface OrderDetailsProps {
  backTo?: string
  isAdmin?: boolean
}

export default function OrderDetails({ backTo = '/orders', isAdmin = false }: OrderDetailsProps) {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return

      try {
        const orderData = await orderApi.getOrderById(id)
        setOrder(orderData)
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Link to="/orders">
            <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {isAdmin ? (
        <div className="w-full">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link to={backTo}>
                <Button variant="ghost" className="mb-2 text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-500 mt-1">Order #{order.id.slice(0, 8)}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  statusColors[order.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary Card */}
              <Card className={`border-l-4 ${statusBorderColors[order.status] || 'border-l-purple-500'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Order Date</span>
                    </div>
                    <span className="font-medium text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package className="w-4 h-4" />
                      <span className="text-sm">Items</span>
                    </div>
                    <span className="font-medium text-sm">{order.items.length}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Total</span>
                      </div>
                      <span className="font-bold text-xl text-purple-600">
                        ${Number(order.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info Card */}
              {order.user ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{order.user.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-sm">{order.user.email || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">Customer information not available</p>
                  </CardContent>
                </Card>
              )}

              {/* Shipping Address Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed">{order.shippingAddress}</p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    Order Items ({order.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover rounded-lg shadow-sm"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.size && item.color && <span className="mx-2">•</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Qty:</span>
                              <span className="font-medium">{item.quantity}</span>
                            </div>
                            <span className="font-bold text-lg text-purple-600">
                              ${(Number(item.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Order Total */}
                    <div className="border-t-2 border-gray-200 pt-4 mt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-700">Order Total</span>
                        <span className="text-2xl font-bold text-purple-600">
                          ${Number(order.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <Link to={backTo}>
                  <Button variant="ghost" className="mb-2 text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                <p className="text-gray-500 mt-1">Order #{order.id.slice(0, 8)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    statusColors[order.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Order Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Order Summary Card */}
                <Card className={`border-l-4 ${statusBorderColors[order.status] || 'border-l-purple-500'}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Order Date</span>
                      </div>
                      <span className="font-medium text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="w-4 h-4" />
                        <span className="text-sm">Items</span>
                      </div>
                      <span className="font-medium text-sm">{order.items.length}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm">Total</span>
                        </div>
                        <span className="font-bold text-xl text-purple-600">
                          ${Number(order.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Info Card */}
                {order.user ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{order.user.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-sm">{order.user.email || 'N/A'}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Customer information not available</p>
                    </CardContent>
                  </Card>
                )}

                {/* Shipping Address Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm leading-relaxed">{order.shippingAddress}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Order Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Package className="w-6 h-6" />
                      Order Items ({order.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.product.name}
                              className="w-24 h-24 object-cover rounded-lg shadow-sm"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.size && item.color && <span className="mx-2">•</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Qty:</span>
                                <span className="font-medium">{item.quantity}</span>
                              </div>
                              <span className="font-bold text-lg text-purple-600">
                                ${(Number(item.price) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Order Total */}
                      <div className="border-t-2 border-gray-200 pt-4 mt-6">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-700">Order Total</span>
                          <span className="text-2xl font-bold text-purple-600">
                            ${Number(order.total).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
