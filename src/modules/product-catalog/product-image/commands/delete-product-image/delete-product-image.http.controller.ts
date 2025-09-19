import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
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
import { match } from 'oxide.ts';
import { ProductImageNotFoundError } from '../../domain/product-image.error';
import { ProductNotFoundError } from 'src/modules/product-catalog/product/domain/product.error';
import { DeleteProductImageCommand } from './delete-product-image.command';
import { DeleteProductImageServiceResult } from './delete-product-image.service';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT_IMAGE}`,
)
@Controller(routesV1.version)
export class DeleteProductImageHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Delete a Product image' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Product image ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product image deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ProductImageNotFoundError.message,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Delete(routesV1.productCatalog.productImage.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') productImageId: bigint): Promise<void> {
    const command = new DeleteProductImageCommand({ productImageId });
    const result: DeleteProductImageServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof ProductNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
