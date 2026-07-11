import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Star, Home } from 'lucide-react'
import { toast } from 'sonner'
import { addressApi, type Address } from '../services/addresses'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import EmptyState from '../components/ui/empty-state'

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  const fetchAddresses = async () => {
    try {
      const data = await addressApi.getAddresses()
      setAddresses(data)
    } catch {
      toast.error('Failed to fetch addresses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleSetPrimary = async (id: string) => {
    try {
      await addressApi.setPrimaryAddress(id)
      toast.success('Address set as primary')
      fetchAddresses()
    } catch {
      toast.error('Failed to set primary address')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      await addressApi.deleteAddress(id)
      toast.success('Address deleted successfully')
      fetchAddresses()
    } catch {
      toast.error('Failed to delete address')
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingAddress(null)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingAddress(null)
    fetchAddresses()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
            <p className="text-gray-500 mt-1">Manage your shipping addresses</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>

        {showForm && (
          <AddressForm
            address={editingAddress}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}

        {addresses.length === 0 ? (
          <EmptyState
            type="generic"
            title="No addresses yet"
            description="You haven't added any addresses yet"
            action={
              <Button
                onClick={() => setShowForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Address
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className={`relative ${
                  address.isPrimary ? 'border-purple-500 border-2' : ''
                }`}
              >
                {address.isPrimary && (
                  <div className="absolute top-2 right-2 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Primary
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Home className="w-5 h-5 text-purple-600" />
                    {address.fullName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>{address.streetAddress}</p>
                    {address.apartment && <p>{address.apartment}</p>}
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p>{address.country}</p>
                    <p>{address.phone}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {!address.isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimary(address.id)}
                        className="flex-1"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Set Primary
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AddressForm({
  address,
  onClose,
  onSuccess,
}: {
  address: Address | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [fullName, setFullName] = useState(address?.fullName || '')
  const [streetAddress, setStreetAddress] = useState(address?.streetAddress || '')
  const [apartment, setApartment] = useState(address?.apartment || '')
  const [city, setCity] = useState(address?.city || '')
  const [state, setState] = useState(address?.state || '')
  const [zipCode, setZipCode] = useState(address?.zipCode || '')
  const [country] = useState(address?.country || 'US')
  const [phone, setPhone] = useState(address?.phone || '')
  const [isPrimary, setIsPrimary] = useState(address?.isPrimary || false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim() || !streetAddress.trim() || !city.trim() || !state.trim() || !zipCode.trim() || !phone.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      if (address) {
        await addressApi.updateAddress(address.id, {
          fullName,
          streetAddress,
          apartment,
          city,
          state,
          zipCode,
          country,
          phone,
          isPrimary,
        })
        toast.success('Address updated successfully')
      } else {
        await addressApi.createAddress({
          fullName,
          streetAddress,
          apartment,
          city,
          state,
          zipCode,
          country,
          phone,
          isPrimary,
        })
        toast.success('Address added successfully')
      }
      onSuccess()
    } catch (error) {
      toast.error('Failed to save address')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{address ? 'Edit Address' : 'Add New Address'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="123 Main Street"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apartment, Suite, etc. (optional)
            </label>
            <input
              type="text"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              placeholder="Apt 4B"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="NY"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="10001"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrimary"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="isPrimary" className="text-sm text-gray-700">
              Set as primary address
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? 'Saving...' : address ? 'Update' : 'Add'} Address
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
