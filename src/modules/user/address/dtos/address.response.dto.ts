import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from 'src/libs/api/response.base';

export class AddressResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: '',
    description: '',
  })
  userId: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  fullName: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  phone: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  street: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  ward: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  district: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  province: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  country: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  postalCode: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  isDefault: boolean | null;
}
