import { ApiResponseProperty } from '@nestjs/swagger';
import { ResponseBase } from 'src/libs/api/response.base';

export class RoleResponseDto extends ResponseBase<any> {
  @ApiResponseProperty({
    type: String,
    example: '',
  })
  roleName: string;

  @ApiResponseProperty({
    type: String,
    example: '',
  })
  roleDesc?: string | null;

  @ApiResponseProperty({
    type: Boolean,
    example: true,
  })
  isActive: boolean;
}
