import { match } from 'oxide.ts';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import {
  FindProductImageQuery,
  FindProductImageQueryResult,
} from './find-product-image.query-handler';
import { ProductImageMapper } from '../../mappers/product-image.mapper';
import { ProductImageNotFoundError } from '../../domain/product-image.error';
import { ProductImageResponseDto } from '../../dtos/product-image.response.dto';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT_IMAGE}`,
)
@Controller(routesV1.version)
export class FindProductImageHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ProductImageMapper,
  ) {}

  @ApiOperation({ summary: 'Find one Product Image' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ProductImage ID',
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
  @UseGuards(AuthJwtGuard)
  @Get(routesV1.productCatalog.productImage.getOne)
  async findProductImage(
    @Param('id') productId: bigint,
  ): Promise<ProductImageResponseDto> {
    const query = new FindProductImageQuery(productId);
    const result: FindProductImageQueryResult =
      await this.queryBus.execute(query);

    return match(result, {
      Ok: (product) => this.mapper.toResponse(product),
      Err: (error: Error) => {
        if (error instanceof ProductImageNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
