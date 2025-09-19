import { match } from 'oxide.ts';

import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { MaterialEntity } from '../../domain/material.entity';
import {
  MaterialNotFoundError,
  MaterialAlreadyInUseError,
} from '../../domain/material.error';
import { MaterialResponseDto } from '../../dtos/material.response.dto';
import { MaterialMapper } from '../../mappers/material.mapper';
import { UpdateMaterialCommand } from './update-material.command';
import { UpdateMaterialRequestDto } from './update-material.request.dto';
import { UpdateMaterialServiceResult } from './update-material.service';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.MATERIAL}`,
)
@Controller(routesV1.version)
export class UpdateMaterialHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: MaterialMapper,
  ) {}

  @ApiOperation({ summary: 'Update a Material' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Material ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MaterialResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: MaterialNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Put(routesV1.productCatalog.material.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') materialId: bigint,
    @Body() body: UpdateMaterialRequestDto,
  ): Promise<MaterialResponseDto> {
    const command = new UpdateMaterialCommand({
      materialId,
      ...body,
      updatedBy: user.email,
    });

    const result: UpdateMaterialServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (product: MaterialEntity) => this.mapper.toResponse(product),
      Err: (error: Error) => {
        if (error instanceof MaterialNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof MaterialAlreadyInUseError) {
          throw new ConflictException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
