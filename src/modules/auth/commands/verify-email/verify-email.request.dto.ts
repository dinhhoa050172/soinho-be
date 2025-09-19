import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailRequestDto {
  @ApiProperty({
    example: '',
    description: 'Token nhận qua email xác thực',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
