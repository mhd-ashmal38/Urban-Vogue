import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create an order from user's cart
   */
  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<any> {
    // Get user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate total
    const total = cart.items.reduce<number>(
      (sum: number, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        shippingAddress: createOrderDto.shippingAddress,
        status: 'PENDING',
        items: {
          create: cart.items.map((item) => {
            // Find the variant that matches the cart item's color
            const matchingVariant = item.product.variants?.find(
              (variant) => variant.color === item.color
            );

            return {
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              size: item.size,
              color: item.color,
              image: matchingVariant && matchingVariant.images.length > 0
                ? matchingVariant.images[0]
                : null,
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
        },
      },
    });

    // Clear the cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  }

  /**
   * Get all orders for a user
   */
  async getUserOrders(userId: string): Promise<any> {
    return await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get a specific order by ID
   */
  async getOrderById(
    orderId: string,
    userId: string,
    userRole: string,
  ): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if user owns the order or is admin
    if (order.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to view this order',
      );
    }

    return order;
  }

  /**
   * Update order status (admin only)
   */
  async updateOrderStatus(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: updateOrderDto.status,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get all orders (admin only)
   */
  async getAllOrders(): Promise<any> {
    return await this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
