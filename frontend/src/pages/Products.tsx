import { useEffect, useState } from 'react'
import { productsApi, categoriesApi } from '../services/products'
import type { Product, Category } from '../services/products'
import { Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Select } from '../components/ui/select'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll()
        setCategories(data)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // Fetch products when category or search changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        let data: Product[]

        if (searchQuery) {
          data = await productsApi.search(searchQuery)
        } else {
          data = await productsApi.getAll(selectedCategory)
        }

        setProducts(data)
      } catch (err) {
        setError('Failed to fetch products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already triggered by the useEffect
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSearchQuery('') // Clear search when category changes
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setSelectedCategory('') // Clear category when searching
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Browse our collection</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 h-full flex flex-col">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full" style={{ height: '88px' }}>
            <div className="flex flex-col md:flex-row gap-4 w-full h-full items-center">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 min-w-0 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </form>

              {/* Category Filter */}
              <div className="flex items-center gap-2 min-w-[200px]">
                <Filter className="text-gray-400 w-5 h-5" />
                <Select
                  value={selectedCategory}
                  onChange={(value) => handleCategoryChange(value)}
                  options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                  placeholder="All Categories"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Products Grid Container */}
          <div className="flex-1 overflow-y-auto">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length === 0 && (
              <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                  <p className="text-gray-600 text-lg">No products found</p>
                  {searchQuery && (
                    <p className="text-gray-500 mt-2">Try a different search term</p>
                  )}
                </div>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-200">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
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
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-600">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {product.category.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
