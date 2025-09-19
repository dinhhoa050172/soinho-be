import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogoutRequestDto {
  @ApiProperty({
    example: '',
    description: 'Access token',
  })
  @IsString()
  token: string;
}
