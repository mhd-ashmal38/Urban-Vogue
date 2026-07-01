import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { productsApi } from '../services/products'
import type { Product } from '../services/products'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const data = await productsApi.getById(id)
        setProduct(data)
      } catch (err) {
        setError('Failed to load product')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return

    // TODO: Implement cart functionality
    toast.success(`Added ${quantity} ${product.name}(s) to cart`)
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const nextImage = () => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Product not found'}</p>
          <Link to="/products" className="text-purple-600 hover:text-purple-800 mt-4 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const currentImage =
    product.images && product.images.length > 0
      ? product.images[currentImageIndex]
      : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-lg overflow-hidden relative">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML =
                        '<div class="w-full h-full flex items-center justify-center text-gray-400">Image unavailable</div>'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}

                {/* Image Navigation */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex
                          ? 'border-purple-600'
                          : 'border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-2">
                  {product.category.name}
                </p>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-purple-600">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <p
                  className={`text-sm ${
                    product.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} items in stock`
                    : 'Out of stock'}
                </p>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>

              <div className="text-sm text-gray-500 space-y-1">
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
