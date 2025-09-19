import { match } from 'oxide.ts';
import {
  ConflictException as ConflictHttpException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserCommand } from './create-user.command';
import { CreateUserRequestDto } from './create-user.request.dto';
import { CreateUserServiceResult } from './create-user.service';
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
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(API_V1_TAGS.SYSTEM_ADMIN)
@Controller(routesV1.version)
export class CreateUserHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: UserMapper,
  ) {}

  @ApiOperation({ summary: 'Create a User' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post(routesV1.sa.user.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    const command = new CreateUserCommand({
      ...body,
      createdBy: user.email,
    });

    const result: CreateUserServiceResult =
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
