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
import { CategoryEntity } from '../../domain/category.entity';
import {
  CategoryNotFoundError,
  CategoryAlreadyInUseError,
} from '../../domain/category.error';
import { CategoryResponseDto } from '../../dtos/category.response.dto';
import { CategoryMapper } from '../../mappers/category.mapper';
import { UpdateCategoryCommand } from './update-category.command';
import { UpdateCategoryRequestDto } from './update-category.request.dto';
import { UpdateCategoryServiceResult } from './update-category.service';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.CATEGORY}`,
)
@Controller(routesV1.version)
export class UpdateCategoryHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: CategoryMapper,
  ) {}

  @ApiOperation({ summary: 'Update a Category' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CategoryNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Put(routesV1.productCatalog.category.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') categoryId: bigint,
    @Body() body: UpdateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const command = new UpdateCategoryCommand({
      categoryId,
      ...body,
      updatedBy: user.email,
    });

    const result: UpdateCategoryServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (product: CategoryEntity) => this.mapper.toResponse(product),
      Err: (error: Error) => {
        if (error instanceof CategoryNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof CategoryAlreadyInUseError) {
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
