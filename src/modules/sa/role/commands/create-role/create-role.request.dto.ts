import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateRoleRequestDto {
  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(50)
  roleName: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(100)
  roleDesc?: string;
}
