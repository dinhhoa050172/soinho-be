import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from 'src/libs/api/response.base';

export class TransactionResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: '',
    description: '',
  })
  orderId: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  userId: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  productId: string;

  @ApiProperty({
    example: 1,
    description: 'The quantity of the product in the transaction',
  })
  quantity: number;

  @ApiProperty({
    example: '100.00',
    description: 'The total price of the transaction',
  })
  totalPrice: string;

  @ApiProperty({
    example: 'PENDING',
    description: 'The status of the transaction',
  })
  status: string;
}
