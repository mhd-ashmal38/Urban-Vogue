import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalOrders, totalRevenue, totalProducts] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { total: true },
      }),
      this.prisma.product.count(),
    ]);

    return {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalProducts,
    };
  }

  async getRevenueData() {
    const orders = await this.prisma.order.findMany({
      where: {
        status: { not: 'CANCELLED' },
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by date (last 30 days)
    const revenueByDate = new Map<string, number>();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    orders.forEach((order) => {
      if (order.createdAt >= thirtyDaysAgo) {
        const date = order.createdAt.toISOString().split('T')[0];
        const current = revenueByDate.get(date) || 0;
        revenueByDate.set(date, current + Number(order.total));
      }
    });

    // Convert to array and sort by date
    const data = Array.from(revenueByDate.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return data;
  }

  async getOrdersData() {
    const orders = await this.prisma.order.findMany({
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by date (last 30 days)
    const ordersByDate = new Map<string, number>();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    orders.forEach((order) => {
      if (order.createdAt >= thirtyDaysAgo) {
        const date = order.createdAt.toISOString().split('T')[0];
        const current = ordersByDate.get(date) || 0;
        ordersByDate.set(date, current + 1);
      }
    });

    // Convert to array and sort by date
    const data = Array.from(ordersByDate.entries())
      .map(([date, orders]) => ({ date, orders }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return data;
  }

  async getRecentOrders() {
    return this.prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getTopProducts() {
    const orderItems = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const productIds = orderItems.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });

    return orderItems
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          id: item.productId,
          name: product?.name || 'Unknown',
          price: product?.price || 0,
          totalSold: item._sum.quantity || 0,
        };
      })
      .sort((a, b) => b.totalSold - a.totalSold);
  }
}
