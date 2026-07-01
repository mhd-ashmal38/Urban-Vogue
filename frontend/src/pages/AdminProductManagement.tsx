import { useEffect, useState } from 'react'
import { productsApi, categoriesApi, type Product, type Category } from '../services/products'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Dialog } from '../components/ui/dialog'
import { Select } from '../components/ui/select'
import { FileUpload } from '../components/ui/file-upload'
import { Table, type Column, type Action } from '../components/ui/table'

export default function AdminProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    images: [] as string[],
  })

  // Image upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const columns: Column<Product>[] = [
    {
      header: 'Product',
      key: 'name',
      render: (_value, product) => (
        <div className="flex items-center">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
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
      render: (_value, product) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
          {product.category.name}
        </span>
      ),
    },
    {
      header: 'Price',
      key: 'price',
      render: (value) => `$${Number(value).toFixed(2)}`,
    },
    {
      header: 'Stock',
      key: 'stock',
    },
    {
      header: 'Images',
      key: 'images',
      render: (_value, product) => product.images?.length || 0,
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
    } catch (err) {
      toast.error('Failed to fetch products')
      console.error(err)
    }
  }

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
      stock: '',
      categoryId: '',
      images: [],
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
      stock: String(product.stock),
      categoryId: product.categoryId,
      images: product.images || [],
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
      stock: '',
      categoryId: '',
      images: [],
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
      setFormData({ ...formData, images: [...formData.images, ...response.images] })
      setSelectedFiles([])
      toast.success('Images uploaded successfully')
    } catch (err) {
      toast.error('Failed to upload images')
      console.error(err)
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = async (index: number) => {
    const imageUrl = formData.images[index]
    
    try {
      await productsApi.deleteImage(imageUrl)
      const newImages = formData.images.filter((_, i) => i !== index)
      setFormData({ ...formData, images: newImages })
      toast.success('Image deleted successfully')
    } catch (err) {
      toast.error('Failed to delete image')
      console.error(err)
    }
  }

  const removeSelectedFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.stock || !formData.categoryId) {
      toast.error('Please fill all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        categoryId: formData.categoryId,
        images: formData.images,
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

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <Button
            onClick={openCreateModal}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Table
          columns={columns}
          data={products}
          actions={actions}
          emptyMessage="No products found. Click 'Add Product' to create one."
          height="calc(100vh - 200px)"
          pageSize={10}
        />
      </div>

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
              disabled={isSubmitting}
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
              <Label htmlFor="price">Price ($) *</Label>
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
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                required
              />
            </div>
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

          {/* Image Upload Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <Label>Product Images</Label>
            <div className="mt-2">
              <FileUpload
                onFilesChange={setSelectedFiles}
                onUpload={handleImageUpload}
                selectedFiles={selectedFiles}
                uploadedFiles={formData.images}
                onRemoveSelected={removeSelectedFile}
                onRemoveUploaded={removeImage}
                uploading={uploadingImages}
                maxFiles={5}
                maxSizeMB={5}
                accept="image/*"
              />
            </div>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        title="Delete Product"
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
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>? This action cannot be undone.
          </p>
        </div>
      </Dialog>
    </div>
  )
}
