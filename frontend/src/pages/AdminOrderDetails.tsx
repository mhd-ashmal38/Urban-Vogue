import AdminLayout from '../components/AdminLayout'
import OrderDetails from './OrderDetails'

export default function AdminOrderDetails() {
  return (
    <AdminLayout>
      <OrderDetails backTo="/admin/orders" isAdmin={true} />
    </AdminLayout>
  )
}
