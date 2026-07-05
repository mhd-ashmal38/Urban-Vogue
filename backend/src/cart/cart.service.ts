import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get or create cart for a user
   */
  private async getOrCreateCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (cart) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return cart;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  /**
   * Get user's cart
   */
  async getCart(userId: string): Promise<{
    id: string;
    items: Array<{
      id: string;
      productId: string;
      name: string;
      price: number;
      quantity: number;
      size: string | null;
      color: string | null;
      image: string | null;
    }>;
    total: number;
  }> {
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

    if (!cart) {
      return {
        id: '',
        items: [],
        total: 0,
      };
    }

    return {
      id: cart.id,
      items: cart.items.map((item) => {
        // Find the variant that matches the cart item's color
        const matchingVariant = item.product.variants?.find(
          variant => variant.color === item.color
        );

        return {
          id: item.id,
          productId: item.productId,
          name: item.product.name,
          price: Number(item.product.price),
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: matchingVariant && matchingVariant.images.length > 0
            ? matchingVariant.images[0]
            : null,
        };
      }),
      total: cart.items.reduce<number>(
        (sum: number, item) => sum + Number(item.product.price) * item.quantity,
        0,
      ),
    };
  }

  /**
   * Add item to cart
   */
  async addItem(userId: string, addItemDto: AddItemDto) {
    const cart = await this.getOrCreateCart(userId);

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: addItemDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: addItemDto.productId,
        size: addItemDto.size || null,
        color: addItemDto.color || null,
      },
    });

    if (existingItem) {
      // Update quantity
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + addItemDto.quantity,
        },
      });
      return this.getCart(userId);
    }

    // Create new cart item
    const createData: any = {
      cartId: cart.id,
      productId: addItemDto.productId,
      quantity: addItemDto.quantity,
    };

    if (addItemDto.size) {
      createData.size = addItemDto.size;
    }

    if (addItemDto.color) {
      createData.color = addItemDto.color;
    }

    await this.prisma.cartItem.create({
      data: createData,
    });

    return this.getCart(userId);
  }

  /**
   * Update item quantity
   */
  async updateItem(
    userId: string,
    itemId: string,
    updateItemDto: UpdateItemDto,
  ) {
    // Check if item belongs to user's cart
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.cart.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this item',
      );
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: updateItemDto.quantity,
      },
    });

    return this.getCart(userId);
  }

  /**
   * Remove item from cart
   */
  async removeItem(userId: string, itemId: string) {
    // Check if item belongs to user's cart
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.cart.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to remove this item',
      );
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  }

  /**
   * Clear cart
   */
  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getCart(userId);
  }

  /**
   * Merge guest cart with user cart
   */
  async mergeCart(userId: string, guestItems: any[]) {
    const cart = await this.getOrCreateCart(userId);

    for (const guestItem of guestItems) {
      // Check if product exists
      const product = await this.prisma.product.findUnique({
        where: { id: guestItem.productId },
      });

      if (!product) continue;

      // Check if item already exists in cart
      const existingItem = await this.prisma.cartItem.findUnique({
        where: {
          cartId_productId_size_color: {
            cartId: cart.id,
            productId: guestItem.productId,
            size: guestItem.size || null,
            color: guestItem.color || null,
          },
        },
      });

      if (existingItem) {
        // Update quantity
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + guestItem.quantity,
          },
        });
      } else {
        // Create new cart item
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: guestItem.productId,
            quantity: guestItem.quantity,
            size: guestItem.size,
            color: guestItem.color,
          },
        });
      }
    }

    return this.getCart(userId);
  }
}
