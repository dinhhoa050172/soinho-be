import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from 'src/libs/api/response.base';

export class ProductImageResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: '',
    description: '',
  })
  url: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  isThumbnail: boolean;

  @ApiProperty({
    example: '',
    description: '',
  })
  productId?: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  productCustomId?: string | null;
}
