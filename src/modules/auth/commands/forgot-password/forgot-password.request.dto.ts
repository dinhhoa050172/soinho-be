import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordRequestDto {
  // Add more properties here
  @ApiProperty({
    example: 'email',
    description: 'Email',
  })
  @IsNotEmpty()
  @MaxLength(150)
  @IsEmail()
  email: string;
}
