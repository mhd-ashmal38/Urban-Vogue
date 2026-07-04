import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../common/types';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * GET /cart
   * Get current user's cart
   * @param req - Request with authenticated user
   * @returns User's cart with items and total
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCart(@Request() req: AuthRequest) {
    return this.cartService.getCart(req.user.id);
  }

  /**
   * POST /cart/items
   * Add item to cart
   * @param req - Request with authenticated user
   * @param addItemDto - Item to add
   * @returns Updated cart
   */
  @Post('items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 200, description: 'Item added to cart' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiBody({ type: AddItemDto })
  addItem(@Request() req: AuthRequest, @Body() addItemDto: AddItemDto) {
    return this.cartService.addItem(req.user.id, addItemDto);
  }

  /**
   * PATCH /cart/items/:id
   * Update item quantity
   * @param req - Request with authenticated user
   * @param id - Cart item ID
   * @param updateItemDto - Updated quantity
   * @returns Updated cart
   */
  @Patch('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Item updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @ApiBody({ type: UpdateItemDto })
  updateItem(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, id, updateItemDto);
  }

  /**
   * DELETE /cart/items/:id
   * Remove item from cart
   * @param req - Request with authenticated user
   * @param id - Cart item ID
   * @returns Updated cart
   */
  @Delete('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  removeItem(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.id, id);
  }

  /**
   * DELETE /cart
   * Clear all items from cart
   * @param req - Request with authenticated user
   * @returns Empty cart
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  clearCart(@Request() req: AuthRequest) {
    return this.cartService.clearCart(req.user.id);
  }

  /**
   * POST /cart/merge
   * Merge guest cart with user cart
   * @param req - Request with authenticated user
   * @param guestItems - Guest cart items from localStorage
   * @returns Merged cart
   */
  @Post('merge')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Merge guest cart with user cart' })
  @ApiResponse({ status: 200, description: 'Cart merged' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'string' },
              quantity: { type: 'number' },
              size: { type: 'string' },
              color: { type: 'string' },
            },
          },
        },
      },
    },
  })
  mergeCart(@Request() req: AuthRequest, @Body('items') guestItems: any[]) {
    return this.cartService.mergeCart(req.user.id, guestItems);
  }
}
