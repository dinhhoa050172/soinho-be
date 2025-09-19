import { match } from 'oxide.ts';
import {
  ConflictException as ConflictHttpException,
  Body,
  Controller,
  HttpStatus,
  UseGuards,
  Param,
  Put,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserCommand } from './update-user.command';
import { UpdateUserRequestDto } from './update-user.request.dto';
import { UpdateUserServiceResult } from './update-user.service';
import { UserAlreadyExistsError } from '../../domain/user.error';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { UserEntity } from '../../domain/user.entity';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { UserMapper } from '../../mappers/user.mapper';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(API_V1_TAGS.SYSTEM_ADMIN)
@Controller(routesV1.version)
export class UpdateUserHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: UserMapper,
  ) {}

  @ApiOperation({ summary: 'Update a User' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'User id',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Put(routesV1.sa.user.update)
  async create(
    @Param('id') userId: bigint,
    @ReqUser() user: RequestUser,
    @Body() body: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    const command = new UpdateUserCommand({
      userId,
      ...body,
      updatedBy: user.email,
    });

    const result: UpdateUserServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (user: UserEntity) => this.mapper.toResponse(user),
      Err: (error: Error) => {
        if (error instanceof UserAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
