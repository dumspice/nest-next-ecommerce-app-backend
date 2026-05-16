import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'New quantity for the cart item',
    example: 3,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}
