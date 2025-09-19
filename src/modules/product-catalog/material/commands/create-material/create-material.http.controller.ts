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
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { MaterialEntity } from '../../domain/material.entity';
import { MaterialAlreadyExistsError } from '../../domain/material.error';
import { MaterialResponseDto } from '../../dtos/material.response.dto';
import { MaterialMapper } from '../../mappers/material.mapper';
import { CreateMaterialCommand } from './create-material.command';
import { CreateMaterialRequestDto } from './create-material.request.dto';
import { CreateMaterialServiceResult } from './create-material.service';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.MATERIAL}`,
)
@Controller(routesV1.version)
export class CreateMaterialHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: MaterialMapper,
  ) {}

  @ApiOperation({ summary: 'Create a Material' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: MaterialResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Post(routesV1.productCatalog.material.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateMaterialRequestDto,
  ): Promise<MaterialResponseDto> {
    const command = new CreateMaterialCommand({
      ...body,
      createdBy: user.email,
    });

    const result: CreateMaterialServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (user: MaterialEntity) => this.mapper.toResponse(user),
      Err: (error: Error) => {
        if (error instanceof MaterialAlreadyExistsError) {
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
