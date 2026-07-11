import { useEffect, useState } from 'react'
import { productsApi, categoriesApi, type Product, type Category } from '../services/products'
import { Plus, Edit, Trash2, Loader2, Search, Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Dialog } from '../components/ui/dialog'
import { Select } from '../components/ui/select'
import { FileUpload } from '../components/ui/file-upload'
import { Table, type Column, type Action } from '../components/ui/table'
import AdminLayout from '../components/AdminLayout'
import SkeletonTable from '../components/ui/skeleton-table'
import EmptyState from '../components/ui/empty-state'

export default function AdminProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    variants: [] as Array<{
      color: string
      images: string[]
      sizeStock: Record<string, number>
      price?: number
    }>,
  })

  // Standard sizes for dress shopping
  const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  // Current variant being edited
  const [currentVariant, setCurrentVariant] = useState<{
    color: string
    images: string[]
    sizeStock: Record<string, number>
    price?: number
  }>({
    color: '',
    images: [],
    sizeStock: {},
    price: undefined,
  })

  // Image upload state for current variant
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const columns: Column<Product>[] = [
    {
      header: 'Product',
      key: 'name',
      sortable: true,
      render: (_value, product) => (
        <div className="flex items-center">
          {product.variants && product.variants.length > 0 && product.variants[0].images.length > 0 ? (
            <img
              src={product.variants[0].images[0]}
              alt={product.name}
              className="h-10 w-10 rounded object-cover mr-3"
            />
          ) : (
            <div className="h-10 w-10 rounded bg-gray-200 mr-3 flex items-center justify-center text-gray-400 text-xs">
              No img
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      sortable: true,
      render: (_value, product) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
          {product.category.name}
        </span>
      ),
    },
    {
      header: 'Price',
      key: 'price',
      sortable: true,
      render: (value) => `$${Number(value).toFixed(2)}`,
    },
    {
      header: 'Stock',
      key: 'stock',
      sortable: true,
      render: (_value, product) => {
        const totalStock = product.variants?.reduce((sum, variant) => {
          const variantStock = Object.values(variant.sizeStock || {}).reduce((s, stock) => s + (stock || 0), 0);
          return sum + variantStock;
        }, 0) || 0;
        return <span className="text-sm font-medium">{totalStock}</span>;
      },
    },
  ]

  const actions: Action<Product>[] = [
    {
      label: '',
      icon: <Edit className="w-4 h-4" />,
      onClick: (product) => openEditModal(product),
      variant: 'primary',
    },
    {
      label: '',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (product) => handleDelete(product.id, product.name),
      variant: 'danger',
    },
  ]

  const fetchProducts = async () => {
    try {
      const data = await productsApi.getAll()
      setProducts(data)
      setFilteredProducts(data)
    } catch (err) {
      toast.error('Failed to fetch products')
      console.error(err)
    }
  }

  // Filter products based on search term
  useEffect(() => {
    ;(async () => {
      if (searchTerm === '') {
        setFilteredProducts(products)
      } else {
        const filtered = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredProducts(filtered)
      }
    })()
  }, [searchTerm, products])

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll()
      setCategories(data)
    } catch (err) {
      toast.error('Failed to fetch categories')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      await fetchProducts()
      await fetchCategories()
    })()
  }, [])

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      variants: [],
    })
    setCurrentVariant({
      color: '',
      images: [],
      sizeStock: {},
      price: undefined,
    })
    setSelectedFiles([])
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      categoryId: product.categoryId,
      variants: product.variants?.map(v => ({
        color: v.color,
        images: v.images,
        sizeStock: v.sizeStock,
        price: v.price ? Number(v.price) : undefined,
      })) || [],
    })
    setCurrentVariant({
      color: '',
      images: [],
      sizeStock: {},
      price: undefined,
    })
    setSelectedFiles([])
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      variants: [],
    })
    setCurrentVariant({
      color: '',
      images: [],
      sizeStock: {},
      price: undefined,
    })
    setSelectedFiles([])
  }

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select images to upload')
      return
    }

    setUploadingImages(true)
    try {
      const response = await productsApi.uploadImages(selectedFiles)
      setCurrentVariant({
        ...currentVariant,
        images: [...currentVariant.images, ...response.images],
      })
      setSelectedFiles([])
      toast.success('Images uploaded successfully')
    } catch (err) {
      toast.error('Failed to upload images')
      console.error(err)
    } finally {
      setUploadingImages(false)
    }
  }

  const removeSelectedFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
  }

  const removeVariantImage = (index: number) => {
    const newImages = currentVariant.images.filter((_, i) => i !== index)
    setCurrentVariant({
      ...currentVariant,
      images: newImages,
    })
  }

  const addVariant = () => {
    if (!currentVariant.color || currentVariant.images.length === 0) {
      toast.error('Please add color name and at least one image')
      return
    }

    const hasStock = Object.values(currentVariant.sizeStock).some(stock => stock > 0)
    if (!hasStock) {
      toast.error('Please add stock for at least one size')
      return
    }

    setFormData({
      ...formData,
      variants: [...formData.variants, { ...currentVariant }],
    })

    setCurrentVariant({
      color: '',
      images: [],
      sizeStock: {},
      price: undefined,
    })
  }

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    })
  }

  const updateSizeStock = (size: string, value: string) => {
    const stock = parseInt(value) || 0
    setCurrentVariant({
      ...currentVariant,
      sizeStock: {
        ...currentVariant.sizeStock,
        [size]: stock,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error('Please fill all required fields')
      return
    }

    if (formData.variants.length === 0) {
      toast.error('Please add at least one color variant')
      return
    }

    setIsSubmitting(true)

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        categoryId: formData.categoryId,
        variants: formData.variants,
      }

      if (editingProduct) {
        await productsApi.update(editingProduct.id, productData)
        toast.success('Product updated successfully')
      } else {
        await productsApi.create(productData)
        toast.success('Product created successfully')
      }

      closeModal()
      fetchProducts()
    } catch (err) {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to create product')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    setProductToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      await productsApi.delete(productToDelete.id)
      toast.success('Product deleted successfully')
      fetchProducts()
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    } catch (err) {
      toast.error('Failed to delete product')
      console.error(err)
    }
  }

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return
    setBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = async () => {
    if (selectedProducts.length === 0) return

    try {
      const ids = selectedProducts.map((p) => p.id)
      await productsApi.bulkDelete(ids)
      toast.success(`${selectedProducts.length} products deleted successfully`)
      fetchProducts()
      setBulkDeleteDialogOpen(false)
      setSelectedProducts([])
    } catch (err) {
      toast.error('Failed to delete products')
      console.error(err)
    }
  }

  const closeBulkDeleteDialog = () => {
    setBulkDeleteDialogOpen(false)
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'Category', 'Price', 'Stock', 'Description', 'Created At']
    const rows = filteredProducts.map((product) => {
      const totalStock = product.variants?.reduce((sum, variant) => {
        const variantStock = Object.values(variant.sizeStock || {}).reduce((s, stock) => s + (stock || 0), 0);
        return sum + variantStock;
      }, 0) || 0;
      return [
        product.name,
        product.category.name,
        product.price.toString(),
        totalStock.toString(),
        product.description || '',
        new Date(product.createdAt).toLocaleDateString(),
      ];
    })

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Products exported successfully')
  }

  if (loading) {
    return (
      <AdminLayout>
        <SkeletonTable rows={10} columns={4} showCheckbox showActions />
      </AdminLayout>
    )
  }

  const content = products.length === 0 ? (
    <EmptyState
      type="products"
      action={
        <Button
          onClick={openCreateModal}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Button>
      }
    />
  ) : (
    <>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </Button>
            {selectedProducts.length > 0 && (
              <Button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Selected ({selectedProducts.length})
              </Button>
            )}
            <Button
              onClick={openCreateModal}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products by name, category, or variant color..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Table */}
        <Table
          columns={columns}
          data={filteredProducts}
          actions={actions}
          emptyMessage="No products found. Click 'Add Product' to create one."
          height="calc(100vh - 300px)"
          pageSize={10}
          selectable={true}
          onSelectionChange={setSelectedProducts}
        />
      </div>

      {/* Delete Dialog */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setProductToDelete(null); }}
        title="Confirm Delete"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => { setDeleteDialogOpen(false); setProductToDelete(null); }}
              variant="outline"
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
        </p>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog
        isOpen={bulkDeleteDialogOpen}
        onClose={closeBulkDeleteDialog}
        title="Confirm Bulk Delete"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={closeBulkDeleteDialog}
              variant="outline"
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete <strong>{selectedProducts.length} products</strong>? This action cannot be undone.
        </p>
        {selectedProducts.length > 0 && (
          <div className="max-h-40 overflow-y-auto">
            <ul className="list-disc list-inside text-sm text-gray-600">
              {selectedProducts.map((product) => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
          </div>
        )}
      </Dialog>
    </>
  )

  return (
    <AdminLayout>
      {content}

      {/* Create/Edit Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={closeModal}
              variant="outline"
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSubmitting || uploadingImages}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter product description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Base Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Select
                label="Category *"
                value={formData.categoryId}
                onChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
                options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                placeholder="Select a category"
              />
            </div>
          </div>

          {/* Color Variants Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <Label>Color Variants</Label>
            <p className="text-xs text-gray-500 mt-1">Add color variants with images and size-specific stock</p>

            {/* Add New Variant */}
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="variantColor">Color Name *</Label>
                <Input
                  id="variantColor"
                  value={currentVariant.color}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, color: e.target.value })}
                  placeholder="e.g., Red, Blue, Black"
                />
              </div>

              <div>
                <Label>Images for this color *</Label>
                <div className="mt-2">
                  <FileUpload
                    onFilesChange={setSelectedFiles}
                    onUpload={handleImageUpload}
                    selectedFiles={selectedFiles}
                    uploadedFiles={currentVariant.images}
                    onRemoveSelected={removeSelectedFile}
                    onRemoveUploaded={removeVariantImage}
                    uploading={uploadingImages}
                    maxFiles={5}
                    maxSizeMB={5}
                    accept="image/*"
                  />
                </div>
              </div>

              <div>
                <Label>Stock by Size</Label>
                <p className="text-xs text-gray-500">Set stock for each available size (0 = out of stock)</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {STANDARD_SIZES.map((size) => (
                    <div key={size}>
                      <Label htmlFor={`stock-${size}`} className="text-sm">{size}</Label>
                      <Input
                        id={`stock-${size}`}
                        type="number"
                        min="0"
                        value={currentVariant.sizeStock[size] || ''}
                        onChange={(e) => updateSizeStock(size, e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="variantPrice">Price Override (optional)</Label>
                <Input
                  id="variantPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentVariant.price || ''}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, price: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Leave empty to use base price"
                />
              </div>

              <Button
                type="button"
                onClick={addVariant}
                className="w-full"
              >
                Add Color Variant
              </Button>
            </div>

            {/* Display Added Variants */}
            {formData.variants.length > 0 && (
              <div className="mt-6 space-y-4">
                <Label>Added Color Variants:</Label>
                {formData.variants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{variant.color}</h4>
                        {variant.price && (
                          <p className="text-sm text-purple-600">Price: ${variant.price.toFixed(2)}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Images:</p>
                      <div className="flex gap-2">
                        {variant.images.map((img, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={img}
                            alt={`${variant.color} variant`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Stock by Size:</p>
                      <div className="flex flex-wrap gap-2">
                        {STANDARD_SIZES.map((size) => {
                          const stock = variant.sizeStock[size] || 0
                          return (
                            <span
                              key={size}
                              className={`px-2 py-1 rounded text-xs ${
                                stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {size}: {stock}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </Dialog>
    </AdminLayout>

  )
}
