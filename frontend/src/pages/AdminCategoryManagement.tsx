import { useEffect, useState } from 'react'
import { categoriesApi, type Category } from '../services/products'
import { Plus, Edit, Trash2, Loader2, Search, Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Dialog } from '../components/ui/dialog'
import { Table, type Column, type Action } from '../components/ui/table'

export default function AdminCategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const columns: Column<Category>[] = [
    {
      header: 'Name',
      key: 'name',
      sortable: true,
      render: (value: string) => <span className="font-medium text-gray-900">{value}</span>,
    },
    {
      header: 'Description',
      key: 'description',
      sortable: true,
      render: (value: string | null) => (
        <span className="text-sm text-gray-500 max-w-xs truncate">{value || '-'}</span>
      ),
    },
    {
      header: 'Created',
      key: 'createdAt',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ]

  const actions: Action<Category>[] = [
    {
      label: '',
      icon: <Edit className="w-4 h-4" />,
      onClick: (category) => openEditModal(category),
      variant: 'primary',
    },
    {
      label: '',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (category) => handleDelete(category.id, category.name),
      variant: 'danger',
    },
  ]

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll()
      setCategories(data)
      setFilteredCategories(data)
    } catch (err) {
      toast.error('Failed to fetch categories')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filter categories based on search term
  useEffect(() => {
    ;(async () => {
      if (searchTerm === '') {
        setFilteredCategories(categories)
      } else {
        const filtered = categories.filter(
          (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredCategories(filtered)
      }
    })()
  }, [searchTerm, categories])

  useEffect(() => {
    ;(async () => {
      await fetchCategories()
    })()
  }, [])

  const openCreateModal = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast.error('Please enter a category name')
      return
    }

    setIsSubmitting(true)

    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
      }

      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, categoryData)
        toast.success('Category updated successfully')
      } else {
        await categoriesApi.create(categoryData)
        toast.success('Category created successfully')
      }

      closeModal()
      fetchCategories()
    } catch (err) {
      toast.error(editingCategory ? 'Failed to update category' : 'Failed to create category')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    setCategoryToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return

    try {
      await categoriesApi.delete(categoryToDelete.id)
      toast.success('Category deleted successfully')
      fetchCategories()
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    } catch (err) {
      toast.error('Failed to delete category')
      console.error(err)
    }
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }

  const handleBulkDelete = () => {
    if (selectedCategories.length === 0) return
    setBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = async () => {
    if (selectedCategories.length === 0) return

    try {
      const ids = selectedCategories.map((cat) => cat.id)
      await categoriesApi.bulkDelete(ids)
      toast.success(`${selectedCategories.length} categories deleted successfully`)
      fetchCategories()
      setBulkDeleteDialogOpen(false)
      setSelectedCategories([])
    } catch (err) {
      toast.error('Failed to delete categories')
      console.error(err)
    }
  }

  const closeBulkDeleteDialog = () => {
    setBulkDeleteDialogOpen(false)
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'Description', 'Created At']
    const rows = filteredCategories.map((category) => [
      category.name,
      category.description || '',
      new Date(category.createdAt).toLocaleDateString(),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `categories_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Categories exported successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading categories...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 mt-1">Manage your product categories</p>
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
            {selectedCategories.length > 0 && (
              <Button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Selected ({selectedCategories.length})
              </Button>
            )}
            <Button
              onClick={openCreateModal}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Table
          columns={columns}
          data={filteredCategories}
          actions={actions}
          emptyMessage="No categories found. Click 'Add Category' to create one."
          height="calc(100vh - 200px)"
          pageSize={10}
          selectable={true}
          onSelectionChange={setSelectedCategories}
        />
      </div>

      {/* Create/Edit Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="sm"
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
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter category name"
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
              placeholder="Enter category description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            />
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        title="Delete Category"
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
            Are you sure you want to delete <strong>"{categoryToDelete?.name}"</strong>? This action cannot be undone and will also delete all products in this category.
          </p>
        </div>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        isOpen={bulkDeleteDialogOpen}
        onClose={closeBulkDeleteDialog}
        title="Delete Multiple Categories"
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
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{selectedCategories.length} categories</strong>? This action cannot be undone and will also delete all products in these categories.
          </p>
          {selectedCategories.length > 0 && (
            <div className="max-h-40 overflow-y-auto">
              <ul className="list-disc list-inside text-sm text-gray-600">
                {selectedCategories.map((category) => (
                  <li key={category.id}>{category.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  )
}
