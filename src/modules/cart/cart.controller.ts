import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { CartResponseDto } from './dto/cart-response.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Get current user's cart
   * Get /cart
   */
  @Get()
  @ApiOperation({
    summary: "Get current user's cart",
  })
  @ApiResponse({
    status: 200,
    description: 'User cart with items',
    type: CartResponseDto,
  })
  async getCart(@GetUser('id') userId: string): Promise<CartResponseDto> {
    return await this.cartService.getOrCreateCart(userId);
  }

  /**
   * Add product to cart
   * Post /cart/items
   */
  @Post('items')
  @ApiOperation({
    summary: 'Add product to cart',
  })
  @ApiBody({
    type: AddToCartDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found!',
  })
  @ApiResponse({
    status: 400,
    description: 'Product unavailable or insufficient stock!',
  })
  async addToCart(
    @Body() addToCartDto: AddToCartDto,
    @GetUser('id') userId: string,
  ): Promise<CartResponseDto> {
    return await this.cartService.addToCart(addToCartDto, userId);
  }

  /**
   * Update cart item quantity
   * PATCH /cart/items/:id
   */

  @Patch('items/:id')
  @ApiOperation({
    summary: 'Update cart item quantity',
  })
  @ApiBody({
    type: UpdateCartItemDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item quantity updated',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Product unavailable or insufficient stock',
  })
  async updateCartItem(
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Param('id') itemId: string,
    @GetUser('id') userId: string,
  ): Promise<CartResponseDto> {
    return await this.cartService.updateCartItem(
      updateCartItemDto,
      itemId,
      userId,
    );
  }

  /**
   * Delete cart item from cart
   * DELETE /cart/items/:id
   */
  @Delete('items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete cart item from cart',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item deleted successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found',
  })
  async removeFromCart(
    @Param('id') itemId: string,
    @GetUser('id') userId: string,
  ): Promise<CartResponseDto> {
    return await this.cartService.removeFromCart(itemId, userId);
  }

  /**
   * Clear cart (delete all items)
   * DELETE /cart/items
   */

  @Delete('items')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Clear cart (delete all items)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart cleared successfully',
    type: CartResponseDto,
  })
  async clearCart(@GetUser('id') userId: string): Promise<CartResponseDto> {
    return await this.cartService.clearCart(userId);
  }

  /**
   * Merge guest cart with user cart after login
   * POST /cart/merge
   */

  @Post('merge')
  @ApiOperation({
    summary: 'Merge guest cart with user cart after login',
  })
  @ApiBody({ type: MergeCartDto })
  @ApiResponse({
    status: 200,
    description: 'Carts merged successfully',
    type: CartResponseDto,
  })
  async mergeCart(
    @GetUser('id') userId: string,
    @Body() mergeCartDto: MergeCartDto,
  ): Promise<CartResponseDto> {
    return await this.cartService.mergeCart(userId, mergeCartDto.items);
  }
}
