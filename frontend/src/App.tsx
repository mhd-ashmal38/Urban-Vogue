import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminDashboard from './pages/AdminDashboard'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import AdminProductManagement from './pages/AdminProductManagement'
import AdminCategoryManagement from './pages/AdminCategoryManagement'
import AdminUserManagement from './pages/AdminUserManagement'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import AdminOrderDetails from './pages/AdminOrderDetails'
import AdminOrders from './pages/AdminOrders'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-screen overflow-x-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminCategoryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminUserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:id"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminOrderDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster 
          position="top-right"
          richColors
          closeButton
        />
      </div>
    </BrowserRouter>
  )
}

export default App
