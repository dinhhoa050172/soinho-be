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
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { RoleMapper } from '../../mappers/role.mapper';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleEntity } from '../../domain/role.entity';
import { RoleAlreadyExistsError } from '../../domain/role.error';
import { RoleResponseDto } from '../../dtos/role.response.dto';
import { CreateRoleCommand } from './create-role.command';
import { CreateRoleRequestDto } from './create-role.request.dto';
import { CreateRoleServiceResult } from './create-role.service';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(API_V1_TAGS.SYSTEM_ADMIN)
@Controller(routesV1.version)
export class CreateRoleHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: RoleMapper,
  ) {}

  @ApiOperation({ summary: 'Create a Role' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post(routesV1.sa.role.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    const command = new CreateRoleCommand({
      ...body,
      createdBy: user.email,
    });

    const result: CreateRoleServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (user: RoleEntity) => this.mapper.toResponse(user),
      Err: (error: Error) => {
        if (error instanceof RoleAlreadyExistsError) {
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
