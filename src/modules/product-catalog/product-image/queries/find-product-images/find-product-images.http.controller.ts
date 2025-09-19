import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Controller, HttpStatus, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { routesV1 } from 'src/configs/app.route';
import { ProductImageMapper } from '../../mappers/product-image.mapper';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { ProductImagePaginatedResponseDto } from '../../dtos/product-image.paginated.response.dto';
import { ProductImageScalarFieldEnum } from '../../database/product-image.repository.prisma';
import {
  FindProductImagesQuery,
  FindProductImagesQueryResult,
} from './find-product-images.query-handler';
import { FindProductImagesRequestDto } from './find-product-images.request.dto';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT_IMAGE}`,
)
@Controller(routesV1.version)
export class FindProductImagesHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ProductImageMapper,
  ) {}

  @ApiOperation({ summary: 'Find Product Images' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductImagePaginatedResponseDto,
  })
  @Get(routesV1.productCatalog.productImage.root)
  async findProducts(
    @Query(
      new DirectFilterPipe<any, Prisma.ProductImageWhereInput>([
        ProductImageScalarFieldEnum.id,
        ProductImageScalarFieldEnum.url,
        ProductImageScalarFieldEnum.isThumbnail,
        ProductImageScalarFieldEnum.productId,
      ]),
    )
    queryParams: FindProductImagesRequestDto,
  ): Promise<ProductImagePaginatedResponseDto> {
    const query = new FindProductImagesQuery(queryParams.findOptions);
    const result: FindProductImagesQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new ProductImagePaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
