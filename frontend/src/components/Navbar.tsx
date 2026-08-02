import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Heart, ShoppingBag } from 'lucide-react'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left side - Category links */}
          <div className="flex items-center gap-8">
            <Link
              to="/products?category=topwear"
              className="text-gray-700 hover:text-black transition-colors font-thin"
            >
              Topwear
            </Link>
            <Link
              to="/products?category=bottomwear"
              className="text-gray-700 hover:text-black transition-colors font-thin"
            >
              Bottomwear
            </Link>
            <Link
              to="/products?category=footwear"
              className="text-gray-700 hover:text-black transition-colors font-thin"
            >
              Footwear
            </Link>
          </div>

          {/* Center - Title */}
          <div className="flex-1 flex justify-center">
            <Link
              to="/home"
              className="text-4xl font-normal text-gray-900 hover:text-black transition-colors"
            >
              Urban Vogue
            </Link>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center gap-6">
            <Link
              to="/profile"
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="Profile"
            >
              <User size={24} strokeWidth={1} />
            </Link>
            <Link
              to="/wishlist"
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={24} strokeWidth={1} />
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={24} strokeWidth={1} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
