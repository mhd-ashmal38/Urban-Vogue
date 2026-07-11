import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MapPin, ArrowRight, Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { orderApi } from '../services/orders'
import { addressApi, type Address } from '../services/addresses'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Select } from '../components/ui/select'
import { Dialog } from '../components/ui/dialog'
import EmptyState from '../components/ui/empty-state'

const COUNTRIES = [
  { value: 'AF', label: 'Afghanistan' },
  { value: 'AL', label: 'Albania' },
  { value: 'DZ', label: 'Algeria' },
  { value: 'AD', label: 'Andorra' },
  { value: 'AO', label: 'Angola' },
  { value: 'AG', label: 'Antigua and Barbuda' },
  { value: 'AR', label: 'Argentina' },
  { value: 'AM', label: 'Armenia' },
  { value: 'AU', label: 'Australia' },
  { value: 'AT', label: 'Austria' },
  { value: 'AZ', label: 'Azerbaijan' },
  { value: 'BS', label: 'Bahamas' },
  { value: 'BH', label: 'Bahrain' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'BB', label: 'Barbados' },
  { value: 'BY', label: 'Belarus' },
  { value: 'BE', label: 'Belgium' },
  { value: 'BZ', label: 'Belize' },
  { value: 'BJ', label: 'Benin' },
  { value: 'BT', label: 'Bhutan' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'BA', label: 'Bosnia and Herzegovina' },
  { value: 'BW', label: 'Botswana' },
  { value: 'BR', label: 'Brazil' },
  { value: 'BN', label: 'Brunei' },
  { value: 'BG', label: 'Bulgaria' },
  { value: 'BF', label: 'Burkina Faso' },
  { value: 'BI', label: 'Burundi' },
  { value: 'KH', label: 'Cambodia' },
  { value: 'CM', label: 'Cameroon' },
  { value: 'CA', label: 'Canada' },
  { value: 'CV', label: 'Cape Verde' },
  { value: 'KY', label: 'Cayman Islands' },
  { value: 'CF', label: 'Central African Republic' },
  { value: 'TD', label: 'Chad' },
  { value: 'CL', label: 'Chile' },
  { value: 'CN', label: 'China' },
  { value: 'CO', label: 'Colombia' },
  { value: 'KM', label: 'Comoros' },
  { value: 'CG', label: 'Congo' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'HR', label: 'Croatia' },
  { value: 'CU', label: 'Cuba' },
  { value: 'CY', label: 'Cyprus' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'DK', label: 'Denmark' },
  { value: 'DJ', label: 'Djibouti' },
  { value: 'DM', label: 'Dominica' },
  { value: 'DO', label: 'Dominican Republic' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'EG', label: 'Egypt' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'GQ', label: 'Equatorial Guinea' },
  { value: 'ER', label: 'Eritrea' },
  { value: 'EE', label: 'Estonia' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'FJ', label: 'Fiji' },
  { value: 'FI', label: 'Finland' },
  { value: 'FR', label: 'France' },
  { value: 'GA', label: 'Gabon' },
  { value: 'GM', label: 'Gambia' },
  { value: 'GE', label: 'Georgia' },
  { value: 'DE', label: 'Germany' },
  { value: 'GH', label: 'Ghana' },
  { value: 'GR', label: 'Greece' },
  { value: 'GD', label: 'Grenada' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'GN', label: 'Guinea' },
  { value: 'GW', label: 'Guinea-Bissau' },
  { value: 'GY', label: 'Guyana' },
  { value: 'HT', label: 'Haiti' },
  { value: 'HN', label: 'Honduras' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'HU', label: 'Hungary' },
  { value: 'IS', label: 'Iceland' },
  { value: 'IN', label: 'India' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'IR', label: 'Iran' },
  { value: 'IQ', label: 'Iraq' },
  { value: 'IE', label: 'Ireland' },
  { value: 'IL', label: 'Israel' },
  { value: 'IT', label: 'Italy' },
  { value: 'JM', label: 'Jamaica' },
  { value: 'JP', label: 'Japan' },
  { value: 'JO', label: 'Jordan' },
  { value: 'KZ', label: 'Kazakhstan' },
  { value: 'KE', label: 'Kenya' },
  { value: 'KI', label: 'Kiribati' },
  { value: 'KW', label: 'Kuwait' },
  { value: 'KG', label: 'Kyrgyzstan' },
  { value: 'LA', label: 'Laos' },
  { value: 'LV', label: 'Latvia' },
  { value: 'LB', label: 'Lebanon' },
  { value: 'LS', label: 'Lesotho' },
  { value: 'LR', label: 'Liberia' },
  { value: 'LY', label: 'Libya' },
  { value: 'LI', label: 'Liechtenstein' },
  { value: 'LT', label: 'Lithuania' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'MO', label: 'Macau' },
  { value: 'MK', label: 'Macedonia' },
  { value: 'MG', label: 'Madagascar' },
  { value: 'MW', label: 'Malawi' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'MV', label: 'Maldives' },
  { value: 'ML', label: 'Mali' },
  { value: 'MT', label: 'Malta' },
  { value: 'MH', label: 'Marshall Islands' },
  { value: 'MR', label: 'Mauritania' },
  { value: 'MU', label: 'Mauritius' },
  { value: 'MX', label: 'Mexico' },
  { value: 'FM', label: 'Micronesia' },
  { value: 'MD', label: 'Moldova' },
  { value: 'MC', label: 'Monaco' },
  { value: 'MN', label: 'Mongolia' },
  { value: 'ME', label: 'Montenegro' },
  { value: 'MA', label: 'Morocco' },
  { value: 'MZ', label: 'Mozambique' },
  { value: 'MM', label: 'Myanmar' },
  { value: 'NA', label: 'Namibia' },
  { value: 'NR', label: 'Nauru' },
  { value: 'NP', label: 'Nepal' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'NE', label: 'Niger' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'KP', label: 'North Korea' },
  { value: 'NO', label: 'Norway' },
  { value: 'OM', label: 'Oman' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'PW', label: 'Palau' },
  { value: 'PA', label: 'Panama' },
  { value: 'PG', label: 'Papua New Guinea' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Peru' },
  { value: 'PH', label: 'Philippines' },
  { value: 'PL', label: 'Poland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'QA', label: 'Qatar' },
  { value: 'RO', label: 'Romania' },
  { value: 'RU', label: 'Russia' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'SN', label: 'Senegal' },
  { value: 'RS', label: 'Serbia' },
  { value: 'SC', label: 'Seychelles' },
  { value: 'SL', label: 'Sierra Leone' },
  { value: 'SG', label: 'Singapore' },
  { value: 'SK', label: 'Slovakia' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'SB', label: 'Solomon Islands' },
  { value: 'SO', label: 'Somalia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'KR', label: 'South Korea' },
  { value: 'SS', label: 'South Sudan' },
  { value: 'ES', label: 'Spain' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'SD', label: 'Sudan' },
  { value: 'SR', label: 'Suriname' },
  { value: 'SZ', label: 'Swaziland' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'SY', label: 'Syria' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'TJ', label: 'Tajikistan' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'TH', label: 'Thailand' },
  { value: 'TG', label: 'Togo' },
  { value: 'TO', label: 'Tonga' },
  { value: 'TT', label: 'Trinidad and Tobago' },
  { value: 'TN', label: 'Tunisia' },
  { value: 'TR', label: 'Turkey' },
  { value: 'TM', label: 'Turkmenistan' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'UZ', label: 'Uzbekistan' },
  { value: 'VU', label: 'Vanuatu' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'YE', label: 'Yemen' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'ZW', label: 'Zimbabwe' },
].sort((a, b) => a.label.localeCompare(b.label))

export default function Checkout() {
  const navigate = useNavigate()
  const { items, getTotalPrice, getTotalItems, clearCart, fetchCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [apartment, setApartment] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('US')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveAddress, setSaveAddress] = useState(false)
  const [setAsPrimary, setSetAsPrimary] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null)

  const subtotal = getTotalPrice()
  const qualifiesForFreeShipping = subtotal >= 199
  const shippingCost = qualifiesForFreeShipping ? 0 : 40
  const orderTotal = subtotal + shippingCost

  const fetchAddresses = useCallback(async () => {
    try {
      const addresses = await addressApi.getAddresses()
      setSavedAddresses(addresses)
      // Auto-select primary address if exists
      const primary = addresses.find(a => a.isPrimary)
      if (primary) {
        setSelectedAddressId(primary.id)
      }
    } catch {
      console.error('Failed to fetch addresses')
    }
  }, [])

  const handleRequestDeleteAddress = (e: React.MouseEvent, addr: Address) => {
    e.stopPropagation()
    setAddressToDelete(addr)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setAddressToDelete(null)
  }

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return
    try {
      await addressApi.deleteAddress(addressToDelete.id)
      toast.success('Address deleted successfully')
      if (selectedAddressId === addressToDelete.id) {
        setSelectedAddressId(null)
      }
      await fetchAddresses()
    } catch {
      toast.error('Failed to delete address')
    } finally {
      closeDeleteDialog()
    }
  }

  const handleEditAddress = (e: React.MouseEvent, address: Address) => {
    e.stopPropagation()
    // Populate form with address data
    setFullName(address.fullName)
    setStreetAddress(address.streetAddress)
    setApartment(address.apartment || '')
    setCity(address.city)
    setState(address.state)
    setZipCode(address.zipCode)
    setCountry(address.country)
    setPhone(address.phone)
    setEditingAddressId(address.id)
    setShowNewAddressForm(true)
    setSelectedAddressId(null)
    setSaveAddress(true)
    setSetAsPrimary(address.isPrimary)
  }

  // Fetch cart and addresses when component mounts if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    ;(async () => {
      await Promise.resolve()
      if (cancelled) return
      await fetchCart()
      await fetchAddresses()
    })()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, fetchCart, fetchAddresses])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (!streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required'
    }
    if (!city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!state.trim()) {
      newErrors.state = 'State is required'
    }
    if (!zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required'
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (field: string, value: string) => {
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Update the field value
    switch (field) {
      case 'fullName':
        setFullName(value)
        break
      case 'streetAddress':
        setStreetAddress(value)
        break
      case 'apartment':
        setApartment(value)
        break
      case 'city':
        setCity(value)
        break
      case 'state':
        setState(value)
        break
      case 'zipCode':
        setZipCode(value)
        break
      case 'phone':
        setPhone(value)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    let shippingAddress: string
    let addressIdToUse: string | undefined

    if (selectedAddressId) {
      // Use selected saved address
      const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId)
      if (!selectedAddress) {
        toast.error('Please select a valid address')
        return
      }
      const countryLabel = COUNTRIES.find(c => c.value === selectedAddress.country)?.label || selectedAddress.country
      const addressParts = [
        selectedAddress.fullName,
        selectedAddress.streetAddress,
        selectedAddress.apartment && `Apt/Suite: ${selectedAddress.apartment}`,
        `${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}`,
        countryLabel,
        `Phone: ${selectedAddress.phone}`
      ].filter(Boolean)
      shippingAddress = addressParts.join(', ')
      addressIdToUse = selectedAddressId
    } else {
      // Use new address form
      if (!validateForm()) {
        return
      }
      const countryLabel = COUNTRIES.find(c => c.value === country)?.label || country
      const addressParts = [
        fullName,
        streetAddress,
        apartment && `Apt/Suite: ${apartment}`,
        `${city}, ${state} ${zipCode}`,
        countryLabel,
        phone && `Phone: ${phone}`
      ].filter(Boolean)
      shippingAddress = addressParts.join(', ')

      // Save address if user opted to
      if (saveAddress || editingAddressId) {
        try {
          let savedAddress: Address
          if (editingAddressId) {
            // Update existing address
            savedAddress = await addressApi.updateAddress(editingAddressId, {
              fullName,
              streetAddress,
              apartment,
              city,
              state,
              zipCode,
              country,
              phone,
              isPrimary: setAsPrimary,
            })
            toast.success('Address updated successfully!')
          } else {
            // Create new address
            savedAddress = await addressApi.createAddress({
              fullName,
              streetAddress,
              apartment,
              city,
              state,
              zipCode,
              country,
              phone,
              isPrimary: setAsPrimary,
            })
            toast.success('Address saved successfully!')
          }
          addressIdToUse = savedAddress.id
          setEditingAddressId(null)
        } catch {
          toast.error('Failed to save address, but order will be placed')
        }
      }
    }

    setIsSubmitting(true)

    try {
      const order = await orderApi.createOrder({
        shippingAddress,
        addressId: addressIdToUse,
        total: orderTotal,
        shippingCost,
      })
      toast.success('Order placed successfully!')
      await clearCart()
      navigate(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error('Order creation error:', error)
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <EmptyState 
            type="cart" 
            action={
              <Link to="/products">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Browse Products
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedAddresses.length > 0 && !showNewAddressForm && (
                  <div className="space-y-4 mb-6">
                    <p className="text-sm font-medium text-gray-700">Select a saved address:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedAddresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddressId(address.id)}
                          className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedAddressId === address.id
                              ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-white shadow-md'
                              : 'border-gray-200 hover:border-purple-300 hover:shadow-sm bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              selectedAddressId === address.id ? 'bg-purple-100' : 'bg-gray-100'
                            }`}>
                              <MapPin className={`w-5 h-5 ${
                                selectedAddressId === address.id ? 'text-purple-600' : 'text-gray-500'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 mb-1">{address.fullName}</p>
                              <p className="text-sm text-gray-600 leading-relaxed">{address.streetAddress}</p>
                              {address.apartment && <p className="text-sm text-gray-600">{address.apartment}</p>}
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p className="text-sm text-gray-600">{address.country}</p>
                              <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                            </div>
                            <div className="flex items-center gap-0">
                              <button
                                onClick={(e) => handleEditAddress(e, address)}
                                className="p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Edit address"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleRequestDeleteAddress(e, address)}
                                className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete address"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowNewAddressForm(true)
                        setSelectedAddressId(null)
                      }}
                      className="w-full border-dashed border-2 hover:border-purple-400 hover:text-purple-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Address
                    </Button>

                    {selectedAddressId && (
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isSubmitting ? 'Placing Order...' : 'Place Order'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                )}

                {(showNewAddressForm || savedAddresses.length === 0) && (
                  <>
                    {savedAddresses.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setShowNewAddressForm(false)
                          setEditingAddressId(null)
                          const primary = savedAddresses.find(a => a.isPrimary)
                          setSelectedAddressId(primary?.id || null)
                          // Reset form
                          setFullName('')
                          setStreetAddress('')
                          setApartment('')
                          setCity('')
                          setState('')
                          setZipCode('')
                          setCountry('US')
                          setPhone('')
                          setSaveAddress(false)
                          setSetAsPrimary(false)
                        }}
                        className="mb-4"
                      >
                        ← Back to saved addresses
                      </Button>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => handleFieldChange('fullName', e.target.value)}
                        placeholder="John Doe"
                        className={`mt-1 ${errors.fullName ? 'border-red-500' : ''}`}
                      />
                      {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="streetAddress">Street Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="streetAddress"
                      type="text"
                      value={streetAddress}
                      onChange={(e) => handleFieldChange('streetAddress', e.target.value)}
                      placeholder="123 Main Street"
                      className={`mt-1 ${errors.streetAddress ? 'border-red-500' : ''}`}
                    />
                    {errors.streetAddress && <p className="mt-1 text-sm text-red-600">{errors.streetAddress}</p>}
                  </div>

                  <div>
                    <Label htmlFor="apartment">Apartment, Suite, etc. (optional)</Label>
                    <Input
                      id="apartment"
                      type="text"
                      value={apartment}
                      onChange={(e) => handleFieldChange('apartment', e.target.value)}
                      placeholder="Apt 4B"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                      <Input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        placeholder="New York"
                        className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}
                      />
                      {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                      <Input
                        id="state"
                        type="text"
                        value={state}
                        onChange={(e) => handleFieldChange('state', e.target.value)}
                        placeholder="NY"
                        className={`mt-1 ${errors.state ? 'border-red-500' : ''}`}
                      />
                      {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code <span className="text-red-500">*</span></Label>
                      <Input
                        id="zipCode"
                        type="text"
                        value={zipCode}
                        onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                        placeholder="10001"
                        className={`mt-1 ${errors.zipCode ? 'border-red-500' : ''}`}
                      />
                      {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select
                      label=""
                      options={COUNTRIES}
                      value={country}
                      onChange={setCountry}
                      placeholder="Select a country"
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="saveAddress"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="saveAddress" className="text-sm text-gray-700">
                        Save this address for future orders
                      </label>
                    </div>
                    {saveAddress && (
                      <div className="flex items-center gap-2 ml-6">
                        <input
                          type="checkbox"
                          id="setAsPrimary"
                          checked={setAsPrimary}
                          onChange={(e) => setSetAsPrimary(e.target.checked)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="setAsPrimary" className="text-sm text-gray-700">
                          Set as primary address
                        </label>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}-${index}`}
                    className="flex gap-4"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                        {item.size && ` • Size: ${item.size}`}
                        {item.color && ` • Color: ${item.color}`}
                      </p>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className={qualifiesForFreeShipping ? 'text-green-600 font-semibold' : 'font-medium'}>
                      {qualifiesForFreeShipping ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        title="Delete Address"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={closeDeleteDialog}
              variant="outline"
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDeleteAddress}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          <p className="text-gray-700">
            Are you sure you want to delete this address? This action cannot be undone.
          </p>
        </div>
      </Dialog>
    </div>
  )
}
