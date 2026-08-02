import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Heart, ShoppingBag, Search, Menu, X, LogOut, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const navigate = useNavigate()
  const { logout, isAuthenticated } = useAuthStore()

  const subcategories = {
    topwear: ['T-Shirts', 'Shirts', 'Jackets', 'Hoodies', 'Sweaters', 'Polos', 'Blazers'],
    bottomwear: ['Jeans', 'Trousers', 'Shorts', 'Skirts', 'Leggings', 'Chinos'],
    footwear: ['Sneakers', 'Boots', 'Sandals', 'Loafers', 'Heels', 'Flats', 'Athletic']
  }

  const getGridColumns = (itemCount: number) => {
    if (itemCount <= 5) return 1
    if (itemCount <= 10) return 2
    if (itemCount <= 15) return 3
    if (itemCount <= 20) return 4
    return 5
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle window resize to close mobile menu when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false)
        setExpandedCategory(null)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate('/login')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="w-full py-4">
        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-3 items-center px-6 lg:grid-cols-[30%_40%_30%]">
          {/* Column 1 - Category links */}
          <div className="flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setHoveredCategory('topwear')}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                to="/products?category=topwear"
                className="text-gray-700 hover:text-black transition-colors font-thin hover:underline underline-offset-4"
              >
                Topwear
              </Link>
              <AnimatePresence>
                {hoveredCategory === 'topwear' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[200px] z-50"
                  >
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${getGridColumns(subcategories.topwear.length)}, minmax(0, 1fr))` }}>
                      {subcategories.topwear.map((subcategory) => (
                        <Link
                          key={subcategory}
                          to={`/products?category=topwear&subcategory=${subcategory.toLowerCase()}`}
                          className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition-colors font-thin"
                          onClick={() => setHoveredCategory(null)}
                        >
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div
              className="relative"
              onMouseEnter={() => setHoveredCategory('bottomwear')}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                to="/products?category=bottomwear"
                className="text-gray-700 hover:text-black transition-colors font-thin hover:underline underline-offset-4"
              >
                Bottomwear
              </Link>
              <AnimatePresence>
                {hoveredCategory === 'bottomwear' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[200px] z-50"
                  >
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${getGridColumns(subcategories.bottomwear.length)}, minmax(0, 1fr))` }}>
                      {subcategories.bottomwear.map((subcategory) => (
                        <Link
                          key={subcategory}
                          to={`/products?category=bottomwear&subcategory=${subcategory.toLowerCase()}`}
                          className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition-colors font-thin"
                          onClick={() => setHoveredCategory(null)}
                        >
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div
              className="relative"
              onMouseEnter={() => setHoveredCategory('footwear')}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                to="/products?category=footwear"
                className="text-gray-700 hover:text-black transition-colors font-thin hover:underline underline-offset-4"
              >
                Footwear
              </Link>
              <AnimatePresence>
                {hoveredCategory === 'footwear' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[200px] z-50"
                  >
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${getGridColumns(subcategories.footwear.length)}, minmax(0, 1fr))` }}>
                      {subcategories.footwear.map((subcategory) => (
                        <Link
                          key={subcategory}
                          to={`/products?category=footwear&subcategory=${subcategory.toLowerCase()}`}
                          className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition-colors font-thin"
                          onClick={() => setHoveredCategory(null)}
                        >
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Column 2 - Title */}
          <div className="flex justify-center xl:justify-start">
            <Link
              to="/home"
              className="text-5xl font-thin text-gray-900 hover:text-black transition-colors"
            >
              Urban Vogue
            </Link>
          </div>

          {/* Column 3 - Icons */}
          <div className="flex items-center gap-6 justify-end">
            <Link
              to="/products"
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="Search"
            >
              <Search size={24} strokeWidth={1} />
            </Link>
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

        {/* Mobile Layout */}
        <div className="lg:hidden flex items-center justify-between px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 hover:text-black transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
          </button>

          {/* Title */}
          <Link
            to="/home"
            className="flex-1 text-center text-3xl font-thin text-gray-900 hover:text-black transition-colors"
          >
            Urban Vogue
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={24} strokeWidth={1} />
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden fixed inset-0 top-[72px] bg-white z-40 overflow-hidden"
            >
              <div className="flex flex-col px-6 py-8 h-full">
                {/* First Section - Categories */}
                <div className="flex flex-col gap-4">
                  <Link
                    to="/products"
                    className="text-gray-700 hover:text-black transition-colors font-thin py-2 flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search size={20} strokeWidth={1} />
                    Search
                  </Link>
                  
                  {/* Topwear */}
                  <div>
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === 'topwear' ? null : 'topwear')}
                      className="text-gray-700 hover:text-black transition-colors font-thin py-2 flex items-center justify-between w-full"
                    >
                      <span>Topwear</span>
                      {expandedCategory === 'topwear' ? <ChevronUp size={16} strokeWidth={1} /> : <ChevronDown size={16} strokeWidth={1} />}
                    </button>
                    <AnimatePresence>
                      {expandedCategory === 'topwear' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 flex flex-col gap-2 py-2">
                            {subcategories.topwear.map((subcategory) => (
                              <Link
                                key={subcategory}
                                to={`/products?category=topwear&subcategory=${subcategory.toLowerCase()}`}
                                className="text-gray-600 hover:text-black transition-colors font-thin py-1 text-sm"
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setExpandedCategory(null)
                                }}
                              >
                                {subcategory}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottomwear */}
                  <div>
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === 'bottomwear' ? null : 'bottomwear')}
                      className="text-gray-700 hover:text-black transition-colors font-thin py-2 flex items-center justify-between w-full"
                    >
                      <span>Bottomwear</span>
                      {expandedCategory === 'bottomwear' ? <ChevronUp size={16} strokeWidth={1} /> : <ChevronDown size={16} strokeWidth={1} />}
                    </button>
                    <AnimatePresence>
                      {expandedCategory === 'bottomwear' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 flex flex-col gap-2 py-2">
                            {subcategories.bottomwear.map((subcategory) => (
                              <Link
                                key={subcategory}
                                to={`/products?category=bottomwear&subcategory=${subcategory.toLowerCase()}`}
                                className="text-gray-600 hover:text-black transition-colors font-thin py-1 text-sm"
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setExpandedCategory(null)
                                }}
                              >
                                {subcategory}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footwear */}
                  <div>
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === 'footwear' ? null : 'footwear')}
                      className="text-gray-700 hover:text-black transition-colors font-thin py-2 flex items-center justify-between w-full"
                    >
                      <span>Footwear</span>
                      {expandedCategory === 'footwear' ? <ChevronUp size={16} strokeWidth={1} /> : <ChevronDown size={16} strokeWidth={1} />}
                    </button>
                    <AnimatePresence>
                      {expandedCategory === 'footwear' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 flex flex-col gap-2 py-2">
                            {subcategories.footwear.map((subcategory) => (
                              <Link
                                key={subcategory}
                                to={`/products?category=footwear&subcategory=${subcategory.toLowerCase()}`}
                                className="text-gray-600 hover:text-black transition-colors font-thin py-1 text-sm"
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setExpandedCategory(null)
                                }}
                              >
                                {subcategory}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Second Section - Profile & Wishlist (Bottom) */}
                <div className="mt-auto border-t border-gray-200 pt-4 flex flex-col gap-4">
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-black transition-colors font-thin py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    className="text-gray-700 hover:text-black transition-colors font-thin py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  {isAuthenticated && (
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-black transition-colors font-thin py-2 flex items-center gap-2 text-left"
                    >
                      <LogOut size={20} strokeWidth={1} />
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
