import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserRequestDto {
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

  @ApiProperty({
    description: 'Tên nhóm người dùng',
  })
  @IsString()
  @MaxLength(50)
  roleName: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  avatarUrl?: string | null;
}
