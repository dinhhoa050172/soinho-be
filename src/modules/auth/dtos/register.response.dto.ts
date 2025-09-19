import { ApiResponseProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiResponseProperty({
    type: String,
    example: 'Đăng ký tài khoản thành công, đã gửi email xác thực',
  })
  msg: string;
}
