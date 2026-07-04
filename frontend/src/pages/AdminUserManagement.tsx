import { useEffect, useState } from 'react'
import { usersApi, type User } from '../services/users'
import { Edit, Trash2, Loader2, Search, Download, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Dialog } from '../components/ui/dialog'
import { Select } from '../components/ui/select'
import { Table, type Column, type Action } from '../components/ui/table'

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string | null; email: string } | null>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER' as 'USER' | 'ADMIN',
    isActive: true,
  })

  const columns: Column<User>[] = [
    {
      header: 'Name',
      key: 'name',
      sortable: true,
      render: (value: string | null) => (
        <span className="font-medium text-gray-900">{value || '-'}</span>
      ),
    },
    {
      header: 'Email',
      key: 'email',
      sortable: true,
      render: (value: string) => <span className="text-gray-700">{value}</span>,
    },
    {
      header: 'Role',
      key: 'role',
      sortable: true,
      render: (value: 'USER' | 'ADMIN') => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            value === 'ADMIN'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value === 'ADMIN' ? <Shield className="w-3 h-3" /> : null}
          {value}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'isActive',
      sortable: true,
      render: (value: boolean) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
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

  const actions: Action<User>[] = [
    {
      label: '',
      icon: <Edit className="w-4 h-4" />,
      onClick: (user) => openEditModal(user),
      variant: 'primary',
    },
    {
      label: '',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (user) => handleDelete(user.id, user.name, user.email),
      variant: 'danger',
    },
  ]

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll()
      setUsers(data)
      setFilteredUsers(data)
    } catch (err) {
      toast.error('Failed to fetch users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filter users based on search term
  useEffect(() => {
    ;(async () => {
      if (searchTerm === '') {
        setFilteredUsers(users)
      } else {
        const filtered = users.filter(
          (user) =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredUsers(filtered)
      }
    })()
  }, [searchTerm, users])

  useEffect(() => {
    ;(async () => {
      await fetchUsers()
    })()
  }, [])

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      role: 'USER',
      isActive: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email) {
      toast.error('Please enter an email')
      return
    }

    setIsSubmitting(true)

    try {
      const userData = {
        name: formData.name || undefined,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
      }

      await usersApi.update(editingUser!.id, userData)
      toast.success('User updated successfully')
      closeModal()
      fetchUsers()
    } catch (err) {
      toast.error('Failed to update user')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string | null, email: string) => {
    setUserToDelete({ id, name, email })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      await usersApi.delete(userToDelete.id)
      toast.success('User deleted successfully')
      fetchUsers()
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (err) {
      toast.error('Failed to delete user')
      console.error(err)
    }
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return
    setBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = async () => {
    if (selectedUsers.length === 0) return

    try {
      const ids = selectedUsers.map((user) => user.id)
      await usersApi.bulkDelete(ids)
      toast.success(`${selectedUsers.length} users deleted successfully`)
      fetchUsers()
      setBulkDeleteDialogOpen(false)
      setSelectedUsers([])
    } catch (err) {
      toast.error('Failed to delete users')
      console.error(err)
    }
  }

  const closeBulkDeleteDialog = () => {
    setBulkDeleteDialogOpen(false)
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Created At']
    const rows = filteredUsers.map((user) => [
      user.name || '',
      user.email,
      user.role,
      user.isActive ? 'Active' : 'Inactive',
      new Date(user.createdAt).toLocaleDateString(),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Users exported successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading users...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
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
            {selectedUsers.length > 0 && (
              <Button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Selected ({selectedUsers.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Table
          columns={columns}
          data={filteredUsers}
          actions={actions}
          emptyMessage="No users found."
          height="calc(100vh - 200px)"
          pageSize={10}
          selectable={true}
          onSelectionChange={setSelectedUsers}
        />
      </div>

      {/* Edit User Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Edit User"
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
              Update User
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter user name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <Select
              label="Role"
              value={formData.role}
              onChange={(value) =>
                setFormData({ ...formData, role: value as 'USER' | 'ADMIN' })
              }
              options={[
                { value: 'USER', label: 'User' },
                { value: 'ADMIN', label: 'Admin' },
              ]}
              placeholder="Select role"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Active Account
            </Label>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        title="Delete User"
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
            Are you sure you want to delete <strong>"{userToDelete?.name || userToDelete?.email}"</strong>? This action cannot be undone.
          </p>
        </div>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        isOpen={bulkDeleteDialogOpen}
        onClose={closeBulkDeleteDialog}
        title="Delete Multiple Users"
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
            Are you sure you want to delete <strong>{selectedUsers.length} users</strong>? This action cannot be undone.
          </p>
          {selectedUsers.length > 0 && (
            <div className="max-h-40 overflow-y-auto">
              <ul className="list-disc list-inside text-sm text-gray-600">
                {selectedUsers.map((user) => (
                  <li key={user.id}>{user.name || user.email}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  )
}
