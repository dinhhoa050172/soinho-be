import { ApiResponseProperty } from '@nestjs/swagger';
import { ResponseBase } from 'src/libs/api/response.base';

export class CategoryResponseDto extends ResponseBase<any> {
  @ApiResponseProperty({
    type: String,
    example: 'hoa-len',
  })
  slug: string;

  @ApiResponseProperty({
    type: String,
    example: 'Hoa len',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example:
      'Những sản phẩm được móc từ len, đặc biệt là hoa len, đang trở thành xu hướng nổi bật trong giới trẻ.',
  })
  desc?: string | null;

  @ApiResponseProperty({
    type: Boolean,
    example: true,
  })
  isActive: boolean;
}
