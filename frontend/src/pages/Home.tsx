import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Heart, User } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-purple-600">Urban Vogue</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the latest trends in fashion. Explore our curated collection of topwear, bottomwear, and footwear.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/products">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-semibold flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/products?category=topwear">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold">
                Browse Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Topwear */}
            <Link to="/products?category=topwear" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 h-64 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Topwear</h3>
                <p className="text-gray-600">T-shirts, Shirts, Jackets & more</p>
              </div>
            </Link>

            {/* Bottomwear */}
            <Link to="/products?category=bottomwear" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 h-64 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Bottomwear</h3>
                <p className="text-gray-600">Jeans, Trousers, Shorts & more</p>
              </div>
            </Link>

            {/* Footwear */}
            <Link to="/products?category=footwear" className="group">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 h-64 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Footwear</h3>
                <p className="text-gray-600">Sneakers, Boots, Sandals & more</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Products</h3>
              <p className="text-gray-600">Curated collection of premium fashion items</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day hassle-free return policy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Shopping</h3>
              <p className="text-gray-600">Safe and secure payment options</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
          <p className="text-purple-100 mb-8 text-lg">
            Join thousands of satisfied customers and discover your perfect style today.
          </p>
          <Link to="/products">
            <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Explore Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
