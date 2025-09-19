import { ApiPropertyOptional } from '@nestjs/swagger';

export class CancelPaymentRequestDto {
  @ApiPropertyOptional({
    example: '',
    description: 'The reason for canceling the payment',
  })
  reason?: string;
}
