// User DTO

import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'User Id',
    example: '80c57488-7499-4a1a-a001-3560d7f8bd4a',
  })
  id!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@exmaple.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    nullable: true,
  })
  firstName!: string | null;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    nullable: true,
  })
  lastName!: string | null;

  @ApiProperty({ description: 'User role', example: 'USER' })
  role!: Role;

  @ApiProperty({
    description: 'Create date',
    example: '2023-12-01T12:34:56.789Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Update date',
    example: '2023-12-01T12:34:56.789Z',
  })
  updatedAt!: Date;
}
