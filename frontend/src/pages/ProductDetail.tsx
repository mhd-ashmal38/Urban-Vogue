import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { productsApi } from '../services/products'
import type { Product, ProductVariant } from '../services/products'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import { useCartStore } from '../store/cartStore'

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const data = await productsApi.getById(id)
        setProduct(data)
        // Select first variant by default
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0])
          // Select first available size
          const firstAvailableSize = STANDARD_SIZES.find(
            size => data.variants[0].sizeStock[size] && data.variants[0].sizeStock[size] > 0
          )
          if (firstAvailableSize) {
            setSelectedSize(firstAvailableSize)
          }
        }
      } catch (err) {
        setError('Failed to load product')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    // Reset image index when variant changes
    setCurrentImageIndex(0)
  }, [selectedVariant])

  const handleAddToCart = async () => {
    if (!product || !selectedVariant || !selectedSize) return

    const variantPrice = selectedVariant.price ? Number(selectedVariant.price) : Number(product.price)
    const stock = selectedVariant.sizeStock[selectedSize] || 0

    if (stock === 0) {
      toast.error('This size is out of stock')
      return
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} items available in stock`)
      return
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: variantPrice,
      quantity,
      size: selectedSize,
      color: selectedVariant.color,
      image: selectedVariant.images[0],
    }

    await addItem(cartItem)
    toast.success(`Added ${quantity} ${product.name}(s) to cart (${selectedVariant.color}, ${selectedSize})`)
  }

  const handleQuantityChange = (delta: number) => {
    if (!selectedVariant || !selectedSize) return
    const stock = selectedVariant.sizeStock[selectedSize] || 0
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity)
    }
  }

  const nextImage = () => {
    if (selectedVariant && selectedVariant.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedVariant.images.length)
    }
  }

  const prevImage = () => {
    if (selectedVariant && selectedVariant.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + selectedVariant.images.length) % selectedVariant.images.length
      )
    }
  }

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    // Select first available size for new variant
    const firstAvailableSize = STANDARD_SIZES.find(
      size => variant.sizeStock[size] && variant.sizeStock[size] > 0
    )
    setSelectedSize(firstAvailableSize || null)
    setQuantity(1)
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    setQuantity(1)
  }

  const getVariantStock = () => {
    if (!selectedVariant) return 0
    return Object.values(selectedVariant.sizeStock || {}).reduce((sum, stock) => sum + (stock || 0), 0)
  }

  const getSelectedSizeStock = () => {
    if (!selectedVariant || !selectedSize) return 0
    return selectedVariant.sizeStock[selectedSize] || 0
  }

  const getDisplayPrice = () => {
    if (!product) return 0
    if (selectedVariant && selectedVariant.price) {
      return Number(selectedVariant.price)
    }
    return Number(product.price)
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
    selectedVariant && selectedVariant.images.length > 0
      ? selectedVariant.images[currentImageIndex]
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
                {selectedVariant && selectedVariant.images.length > 1 && (
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
              {selectedVariant && selectedVariant.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {selectedVariant.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
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
                  ${getDisplayPrice().toFixed(2)}
                </p>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>

              {/* Color Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Color:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantChange(variant)}
                        className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedVariant?.id === variant.id
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-blue-400'
                        }`}
                      >
                        {variant.color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {selectedVariant && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Size:</p>
                  <div className="flex flex-wrap gap-2">
                    {STANDARD_SIZES.map((size) => {
                      const stock = selectedVariant.sizeStock[size] || 0
                      const isOutOfStock = stock === 0
                      return (
                        <button
                          key={size}
                          onClick={() => !isOutOfStock && handleSizeChange(size)}
                          disabled={isOutOfStock}
                          className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedSize === size
                              ? 'border-purple-600 bg-purple-50 text-purple-700'
                              : isOutOfStock
                              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'border-gray-300 text-gray-700 hover:border-purple-400'
                          }`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

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
                      disabled={!selectedSize || quantity >= getSelectedSizeStock()}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <p
                  className={`text-sm ${
                    getSelectedSizeStock() > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {selectedSize
                    ? getSelectedSizeStock() > 0
                      ? `${getSelectedSizeStock()} items in stock for ${selectedSize}`
                      : `${selectedSize} is out of stock`
                    : getVariantStock() > 0
                    ? `${getVariantStock()} items in stock across all sizes`
                    : 'Out of stock'}
                </p>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || !selectedSize || getSelectedSizeStock() === 0}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {selectedVariant && selectedSize && getSelectedSizeStock() > 0 ? 'Add to Cart' : 'Select Size'}
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
