import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from 'src/modules/products/dto/product-response.dto';

export class CartItemResponseDto {
  @ApiProperty({
    description: 'Cart item Id',
    example: '1fb66987-49b0-46b8-a71f-40f518cc2b84',
  })
  id!: string;

  @ApiProperty({
    description: 'Cart Id',
    example: '1fb66987-49b0-46b8-a71f-40f518cc2b84',
  })
  cartId!: string;

  @ApiProperty({
    description: 'Product Id',
    example: '1fb66987-49b0-46b8-a71f-40f518cc2b84',
  })
  productId!: string;

  @ApiProperty({
    description: 'Quantity',
    example: 2,
  })
  quantity!: number;

  @ApiProperty({
    description: 'Product details',
    type: () => ProductResponseDto,
  })
  product!: ProductResponseDto;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt!: Date;
}
