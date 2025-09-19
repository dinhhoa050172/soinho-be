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
import { UpdateProductCommand } from './update-product.command';
import { UpdateProductRequestDto } from './update-product.request.dto';
import { UpdateProductServiceResult } from './update-product.service';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { ProductEntity } from '../../domain/product.entity';
import {
  ProductAlreadyInUseError,
  ProductNotFoundError,
} from '../../domain/product.error';
import { ProductResponseDto } from '../../dtos/product.response.dto';
import { ProductMapper } from '../../mappers/product.mapper';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT}`,
)
@Controller(routesV1.version)
export class UpdateProductHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ProductMapper,
  ) {}

  @ApiOperation({ summary: 'Update a Product' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ProductNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Put(routesV1.productCatalog.product.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') productId: bigint,
    @Body() body: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const command = new UpdateProductCommand({
      productId,
      ...body,
      updatedBy: user.email,
    });

    const result: UpdateProductServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (product: ProductEntity) => this.mapper.toResponse(product),
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
