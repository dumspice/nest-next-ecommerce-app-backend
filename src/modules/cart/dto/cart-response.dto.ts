import { ApiProperty } from '@nestjs/swagger';
import { CartItemResponseDto } from './cart-items-response.dto';

export class CartResponseDto {
  @ApiProperty({
    description: 'Cart ID',
    example: '817241hbv-1247-123a-123123987123',
  })
  id!: string;

  @ApiProperty({
    description: 'User ID',
    example: '111231231ab-1231-j123-1284718275',
  })
  userId!: string;

  @ApiProperty({
    description: 'Cart items',
    type: [CartItemResponseDto],
  })
  cartItems!: CartItemResponseDto[];

  @ApiProperty({
    description: 'Total cart values',
    example: 299.97,
  })
  totalPrice!: number;

  @ApiProperty({
    description: 'Total items count',
    example: 3,
  })
  totalItems!: number;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt!: Date;
}
