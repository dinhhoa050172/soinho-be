import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Controller, HttpStatus, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { routesV1 } from 'src/configs/app.route';
import { ProductMapper } from '../../mappers/product.mapper';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { FindProductsWithImagesRequestDto } from './find-products-with-images.request.dto';
import {
  FindProductsWithImagesQuery,
  FindProductsWithImagesQueryResult,
} from './find-products-with-images.query-handler';
import { ProductPaginatedResponseDto } from '../../dtos/product.paginated.response.dto';
import { ProductScalarFieldEnum } from '../../database/product.repository.prisma';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT}`,
)
@Controller(routesV1.version)
export class FindProductsWithImagesHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ProductMapper,
  ) {}

  @ApiOperation({ summary: 'Find Products with image' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductPaginatedResponseDto,
  })
  @Get(routesV1.productCatalog.product.productWithImages)
  async findProductsWithImage(
    @Query(
      new DirectFilterPipe<any, Prisma.ProductWhereInput>([
        ProductScalarFieldEnum.id,
        ProductScalarFieldEnum.slug,
        ProductScalarFieldEnum.name,
        ProductScalarFieldEnum.price,
        ProductScalarFieldEnum.height,
        ProductScalarFieldEnum.width,
        ProductScalarFieldEnum.length,
        ProductScalarFieldEnum.stockQty,
        ProductScalarFieldEnum.description,
        ProductScalarFieldEnum.categoryId,
        ProductScalarFieldEnum.materialId,
      ]),
    )
    queryParams: FindProductsWithImagesRequestDto,
  ): Promise<ProductPaginatedResponseDto> {
    const query = new FindProductsWithImagesQuery(queryParams.findOptions);
    const result: FindProductsWithImagesQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new ProductPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
