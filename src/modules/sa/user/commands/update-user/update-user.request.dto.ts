import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRequestDto {
  @ApiPropertyOptional({
    example: 'John',
    description: 'First name',
  })
  @IsOptional()
  @IsString()
  @MaxLength(22)
  firstName: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name',
  })
  @IsOptional()
  @IsString()
  @MaxLength(22)
  lastName: string;

  @ApiPropertyOptional({
    example: 'example@gmail.com',
    description: 'Email',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '12345678',
    description: 'Phone number',
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  phone?: string | null;

  @ApiPropertyOptional({
    example: 'password123',
    description: 'Password',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  password?: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  avatarUrl?: string | null;
}
