import { match } from 'oxide.ts';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { ProductNotFoundError } from '../../domain/product.error';
import { ProductResponseDto } from '../../dtos/product.response.dto';
import { ProductMapper } from '../../mappers/product.mapper';
import {
  FindProductQuery,
  FindProductQueryResult,
} from './find-product.query-handler';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT}`,
)
@Controller(routesV1.version)
export class FindProductHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ProductMapper,
  ) {}

  @ApiOperation({ summary: 'Find one Product' })
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
  @Get(routesV1.productCatalog.product.getOne)
  async findProduct(
    @Param('id') productId: bigint,
  ): Promise<ProductResponseDto> {
    const query = new FindProductQuery(productId);
    const result: FindProductQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (product) => this.mapper.toResponse(product),
      Err: (error: Error) => {
        if (error instanceof ProductNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
