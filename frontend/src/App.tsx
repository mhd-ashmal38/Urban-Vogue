import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Placeholder pages - we'll create these next
function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Urban Vogue</h1>
        <p className="text-gray-600 mb-8">Welcome to Urban Vogue</p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <p className="text-gray-600">Login page - coming soon</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 block">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        <p className="text-gray-600">Register page - coming soon</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 block">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

function Profile() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <p className="text-gray-600">Profile page - coming soon</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 block">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
