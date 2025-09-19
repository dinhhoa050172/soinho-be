import {
  Controller,
  HttpStatus,
  UseGuards,
  NotFoundException as NotFoundHttpException,
  Get,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { UserProfileNotFoundError } from '../../domain/user-profile.error';
import { UserProfileResponseDto } from '../../dtos/user-profile.response.dto';
import { UserProfileMapper } from '../../mappers/user-profile.mapper';
import {
  FindUserProfileQuery,
  FindUserProfileQueryResult,
} from './find-user-profile.query-handler';
import { match } from 'oxide.ts';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.USER_PROFILE}`)
@Controller(routesV1.version)
export class FindUserProfileHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: UserProfileMapper,
  ) {}

  @ApiOperation({ summary: 'Find user profile' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: UserProfileNotFoundError.message,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Get(routesV1.user.userProfile.root)
  async findUserProfile(
    @ReqUser() user: RequestUser,
  ): Promise<UserProfileResponseDto> {
    const query = new FindUserProfileQuery(BigInt(user.id));
    const result: FindUserProfileQueryResult =
      await this.queryBus.execute(query);

    return match(result, {
      Ok: (userProfile) => this.mapper.toResponse(userProfile),
      Err: (error) => {
        if (error instanceof UserProfileResponseDto) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
