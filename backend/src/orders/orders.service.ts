import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create an order from user's cart
   */
  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<
    /* eslint-disable prettier/prettier */
    Prisma.OrderGetPayload<{
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
    }>
    /* eslint-enable prettier/prettier */
  > {
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

    // Validate stock availability and prepare variant updates
    const variantUpdates: Array<{
      variantId: string;
      size: string;
      quantity: number;
    }> = [];

    for (const item of cart.items) {
      const matchingVariant = item.product.variants?.find(
        (variant) => variant.color === item.color,
      );

      if (!matchingVariant) {
        throw new BadRequestException(
          `Variant not found for color: ${item.color}`,
        );
      }

      const sizeStock =
        (matchingVariant.sizeStock as Record<string, number>) || {};
      const currentStock = sizeStock[item.size || ''] || 0;

      if (currentStock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${item.product.name} (${item.color}, ${item.size}). Available: ${currentStock}, Requested: ${item.quantity}`,
        );
      }

      variantUpdates.push({
        variantId: matchingVariant.id,
        size: item.size || '',
        quantity: item.quantity,
      });
    }

    // Calculate total including shipping (frontend policy: free >= 199 else 40)
    const itemsTotal = cart.items.reduce<number>(
      (sum: number, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
    const shippingCost = itemsTotal >= 199 ? 0 : 40;
    const total = itemsTotal + shippingCost;

    // Use transaction to ensure atomicity
    const order = await this.prisma.$transaction(
      async (
        tx,
      ): Promise<
        Prisma.OrderGetPayload<{
          include: {
            items: {
              include: {
                product: {
                  include: {
                    variants: true;
                  };
                };
              };
            };
          };
        }>
      > => {
        // Deduct stock from variants
        for (const update of variantUpdates) {
          const variant = await tx.productVariant.findUnique({
            where: { id: update.variantId },
          });

          if (!variant) {
            throw new BadRequestException('Variant not found');
          }

          const sizeStock = (variant.sizeStock as Record<string, number>) || {};
          const updatedSizeStock = { ...sizeStock };
          updatedSizeStock[update.size] =
            (updatedSizeStock[update.size] || 0) - update.quantity;

          await tx.productVariant.update({
            where: { id: update.variantId },
            data: { sizeStock: updatedSizeStock },
          });
        }

        // Create order with items
        const newOrder = await tx.order.create({
          data: {
            userId,
            total,
            shippingAddress: createOrderDto.shippingAddress,
            addressId: createOrderDto.addressId,
            status: 'PENDING',
            items: {
              create: cart.items.map((item) => {
                const matchingVariant = item.product.variants?.find(
                  (variant) => variant.color === item.color,
                );

                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.product.price,
                  size: item.size,
                  color: item.color,
                  image:
                    matchingVariant && matchingVariant.images.length > 0
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
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        return newOrder;
      },
    );

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

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // If cancelling, restore stock
    if (updateOrderDto.status === 'CANCELLED' && order.status !== 'CANCELLED') {
      await this.prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          const matchingVariant = item.product.variants?.find(
            (variant) => variant.color === item.color,
          );

          if (!matchingVariant) {
            continue; // Skip if variant not found
          }

          const variant = await tx.productVariant.findUnique({
            where: { id: matchingVariant.id },
          });

          if (!variant) {
            continue;
          }

          // Restore stock
          const sizeStock = (variant.sizeStock as Record<string, number>) || {};
          const updatedSizeStock = { ...sizeStock };
          const size = item.size || '';

          updatedSizeStock[size] =
            (updatedSizeStock[size] || 0) + item.quantity;

          await tx.productVariant.update({
            where: { id: matchingVariant.id },
            data: { sizeStock: updatedSizeStock },
          });
        }

        // Update order status
        await tx.order.update({
          where: { id: orderId },
          data: { status: updateOrderDto.status },
        });
      });

      // Return updated order
      return await this.prisma.order.findUnique({
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
        },
      });
    }

    // Normal status update
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
