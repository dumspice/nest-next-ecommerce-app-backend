import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartItemResponseDto } from './dto/cart-items-response.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Get current user's cart
  async getOrCreateCart(userId: string): Promise<CartResponseDto> {
    return this.getOrCreateActiveCart(userId);
  }

  // Add To Cart
  async addToCart(
    addToCartDto: AddToCartDto,
    userId: string,
  ): Promise<CartResponseDto> {
    const { productId, quantity } = addToCartDto;

    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not active');
    }

    if (quantity > product.stock) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}`,
      );
    }

    const cart = await this.getOrCreateActiveCart(userId);

    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;

      if (product.stock < quantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${product.stock}, Current in cart: ${existingCartItem.quantity}`,
        );
      }

      await this.prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getOrCreateActiveCart(userId);
  }

  // Update Cart Item Quantity
  async updateCartItem(
    updateCartItemDto: UpdateCartItemDto,
    itemId: string,
    userId: string,
  ): Promise<CartResponseDto> {
    const { quantity } = updateCartItemDto;

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${cartItem.product.stock}`,
      );
    }

    await this.prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
      },
    });

    return this.getOrCreateActiveCart(userId);
  }

  // Remove cart item from cart
  async removeFromCart(
    itemId: string,
    userId: string,
  ): Promise<CartResponseDto> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getOrCreateActiveCart(userId);
  }

  // Clear cart (delete all items)
  async clearCart(userId: string): Promise<CartResponseDto> {
    const cart = await this.prisma.cart.findFirst({
      where: { userId, checkedOut: false },
    });

    if (!cart) {
      throw new NotFoundException('Active cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getOrCreateActiveCart(userId);
  }

  // Merge guest cart with user cart after login
  async mergeCart(
    userId: string,
    items: { productId: string; quantity: number }[],
  ): Promise<CartResponseDto> {
    if (!items || items.length === 0) {
      return this.getOrCreateActiveCart(userId);
    }

    for (const item of items) {
      try {
        await this.addToCart(
          {
            productId: item.productId,
            quantity: item.quantity,
          },
          userId,
        );
      } catch (error) {
        console.warn(
          `[CartService] Failed to merge item ${item.productId}: `,
          error.message,
        );
      }
    }
    return this.getOrCreateActiveCart(userId);
  }

  private formatCart(cart: any): CartResponseDto {
    const cartItems: CartItemResponseDto[] = cart.cartItems.map(
      (item: any) => ({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity,
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }),
    );

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      cartItems,
      totalPrice,
      totalItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  private async getOrCreateActiveCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: {
        userId,
        checkedOut: false,
      },
      include: {
        cartItems: {
          include: { product: true },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          cartItems: {
            include: { product: true },
          },
        },
      });
    }

    return this.formatCart(cart);
  }
}
