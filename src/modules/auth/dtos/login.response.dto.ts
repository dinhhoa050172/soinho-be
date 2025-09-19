import { ApiResponseProperty } from '@nestjs/swagger';
import { UserProfileResponseDto } from './user-profile.response.dto';

export class LoginResponseDto {
  @ApiResponseProperty({
    type: String,
    example: '',
  })
  accessToken: string;

  @ApiResponseProperty({
    type: String,
    example: '',
  })
  refreshToken: string;

  @ApiResponseProperty({
    type: UserProfileResponseDto,
    example: UserProfileResponseDto,
  })
  userProfile: UserProfileResponseDto;
}
