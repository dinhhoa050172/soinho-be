import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestDto {
  // Add more properties here
  @ApiProperty({
    example: '',
    description: 'The old password of the user',
  })
  @IsNotEmpty()
  @MaxLength(255)
  oldPassword: string;

  @ApiProperty({
    example: '',
    description: 'The new password of the user',
  })
  @IsNotEmpty()
  @MaxLength(255)
  newPassword: string;
}
