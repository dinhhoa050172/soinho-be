import { ApiResponseProperty } from '@nestjs/swagger';

export class ForgotPasswordResponseDto {
  @ApiResponseProperty({
    type: String,
    example: 'Đã gửi email đặt lại mật khẩu',
  })
  msg: string;
}
