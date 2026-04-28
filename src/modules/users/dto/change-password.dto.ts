import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

// Change Password Dto
export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password of user',
    example: 'Password123@',
  })
  @IsString()
  @IsNotEmpty({ message: 'Current password must not be empty' })
  currentPassword!: string;

  @ApiProperty({
    description: 'New password changed by user',
    example: 'Password1234@',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'New password must not be empty' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword?: string;
}
