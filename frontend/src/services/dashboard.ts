import api from './api'

export interface DashboardStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalProducts: number
}

export interface RevenueData {
  date: string
  revenue: number
}

export interface OrdersData {
  date: string
  orders: number
}

export interface RecentOrder {
  id: string
  total: number
  status: string
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

export interface TopProduct {
  id: string
  name: string
  price: number
  totalSold: number
}

const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },

  getRevenueData: async (): Promise<RevenueData[]> => {
    const response = await api.get('/dashboard/revenue')
    return response.data
  },

  getOrdersData: async (): Promise<OrdersData[]> => {
    const response = await api.get('/dashboard/orders')
    return response.data
  },

  getRecentOrders: async (): Promise<RecentOrder[]> => {
    const response = await api.get('/dashboard/recent-orders')
    return response.data
  },

  getTopProducts: async (): Promise<TopProduct[]> => {
    const response = await api.get('/dashboard/top-products')
    return response.data
  },
}

export default dashboardApi
