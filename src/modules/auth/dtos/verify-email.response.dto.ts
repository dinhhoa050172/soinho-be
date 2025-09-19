import { ApiResponseProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
  @ApiResponseProperty({
    type: String,
    example: 'Xác thực email thành công',
  })
  msg: string;
}
