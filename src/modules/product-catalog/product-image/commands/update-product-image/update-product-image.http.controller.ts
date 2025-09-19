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
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { ProductImageEntity } from '../../domain/product-image.entity';
import { ProductImageResponseDto } from '../../dtos/product-image.response.dto';
import { ProductImageMapper } from '../../mappers/product-image.mapper';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import {
  ProductNotFoundError,
  ProductAlreadyInUseError,
} from 'src/modules/product-catalog/product/domain/product.error';
import { ProductImageNotFoundError } from '../../domain/product-image.error';
import { UpdateProductImageCommand } from './update-product-image.command';
import { UpdateProductImageRequestDto } from './update-product-image.request.dto';
import { UpdateProductImageServiceResult } from './update-product-image.service';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT_IMAGE}`,
)
@Controller(routesV1.version)
export class UpdateProductImageHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ProductImageMapper,
  ) {}

  @ApiOperation({ summary: 'UpdateImage a Product' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Product image ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductImageResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ProductImageNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Put(routesV1.productCatalog.productImage.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') productImageId: bigint,
    @Body() body: UpdateProductImageRequestDto,
  ): Promise<ProductImageResponseDto> {
    const command = new UpdateProductImageCommand({
      productImageId,
      ...body,
      updatedBy: user.email,
    });

    const result: UpdateProductImageServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (product: ProductImageEntity) => this.mapper.toResponse(product),
      Err: (error: Error) => {
        if (error instanceof ProductNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof ProductAlreadyInUseError) {
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
