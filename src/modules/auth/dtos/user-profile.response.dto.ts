import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiPropertyOptional({
    example: '',
    description: 'Full Name',
  })
  fullName: string;

  @ApiProperty({
    example: '',
    description: 'Email',
  })
  email: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Số điện thoại',
  })
  phone?: string | null;

  @ApiProperty({
    example: '',
    description: 'Nhóm người dùng',
  })
  roleName: string;

  @ApiProperty({
    example: true,
    description: 'Is active',
  })
  isActive: boolean;

  @ApiProperty({
    example: false,
    description: 'Xác thực email',
  })
  emailVerified: boolean;
}
