import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentMethodRequestDto {
  @ApiProperty({})
  name: string;

  @ApiProperty({})
  description?: string | null;

  @ApiProperty({})
  isActive: boolean;
}
