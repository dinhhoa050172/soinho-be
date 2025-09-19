import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    example: 'John',
    description: 'First name',
  })
  @IsString()
  @MaxLength(22)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
  })
  @IsString()
  @MaxLength(22)
  lastName: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
