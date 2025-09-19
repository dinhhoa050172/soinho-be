import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from 'src/libs/api/response.base';

export class PaymentMethodResponseDto extends ResponseBase<any> {
  @ApiProperty({})
  name: string;

  @ApiProperty({})
  description?: string | null;

  @ApiProperty({})
  isActive: boolean;
}
