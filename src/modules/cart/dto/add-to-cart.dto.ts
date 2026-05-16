import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    description: 'Product Id to add to cart',
    example: '1fb66987-49b0-46b8-a71f-40f518cc2b84',
  })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({
    description: 'Quantity of product',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}
