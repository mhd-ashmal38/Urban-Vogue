import { useEffect, useState } from 'react'
import { Package, Calendar, DollarSign, User, Eye } from 'lucide-react'
import { orderApi, type Order, type OrderItem } from '../services/orders'
import { Table, type Column, type Action } from '../components/ui/table'
import AdminLayout from '../components/AdminLayout'
import SkeletonTable from '../components/ui/skeleton-table'
import EmptyState from '../components/ui/empty-state'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null)

  const columns: Column<Order>[] = [
    {
      header: 'Order ID',
      key: 'id',
      sortable: true,
      render: (value: string) => <span className="font-mono text-sm">#{value.slice(0, 8)}</span>,
    },
    {
      header: 'Customer',
      key: 'user',
      sortable: true,
      render: (value: Order['user']) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{value?.name || value?.email || 'N/A'}</span>
        </div>
      ),
    },
    {
      header: 'Date',
      key: 'createdAt',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: 'Items',
      key: 'items',
      sortable: true,
      render: (value: OrderItem[]) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          {value.length} item{value.length !== 1 ? 's' : ''}
        </div>
      ),
    },
    {
      header: 'Total',
      key: 'total',
      sortable: true,
      render: (value: number | string) => (
        <div className="flex items-center gap-2 text-sm font-medium">
          <DollarSign className="w-4 h-4" />
          ${Number(value).toFixed(2)}
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (value: string, row: Order) => {
        const isOpen = openDropdown === row.id
        
        const handleBadgeClick = (e: React.MouseEvent<HTMLSpanElement>) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setDropdownPosition({
            top: rect.bottom + 4,
            left: rect.left,
          })
          setOpenDropdown(isOpen ? null : row.id)
        }
        
        return (
          <>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}
              onClick={handleBadgeClick}
            >
              {value}
            </span>
            
            {isOpen && dropdownPosition && (
              <div 
                className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] min-w-[140px] overflow-hidden"
                style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
              >
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 block whitespace-nowrap ${
                      option.value === value ? 'bg-gray-50 font-medium' : ''
                    }`}
                    onClick={() => {
                      handleStatusChange(row.id, option.value)
                      setOpenDropdown(null)
                      setDropdownPosition(null)
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )
      },
    },
  ]

  const actions: Action<Order>[] = [
    {
      label: 'View',
      icon: <Eye className="w-4 h-4" />,
      onClick: (order) => window.location.href = `/admin/orders/${order.id}`,
      className: 'px-3 py-1.5 rounded-md border border-gray-200 text-sm font-medium transition-colors hover:bg-gray-50 hover:text-gray-700',
    },
  ]

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await orderApi.getAllOrders()
        setOrders(ordersData)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderApi.updateOrderStatus(orderId, {
        status: newStatus as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
      })
      setOrders(orders.map((order) => 
        order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
      ))
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <SkeletonTable rows={10} columns={6} showCheckbox={false} showActions />
      </AdminLayout>
    )
  }

  if (orders.length === 0) {
    return (
      <AdminLayout>
        <EmptyState type="orders" />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Orders</h1>

        <Table
          columns={columns}
          data={orders}
          actions={actions}
          emptyMessage="No orders found. Orders will appear here when customers make purchases."
          height="calc(100vh - 200px)"
          pageSize={10}
          selectable={false}
        />
      </div>
    </AdminLayout>
  )
}
