import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Controller, HttpStatus, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { routesV1 } from 'src/configs/app.route';
import { ProductMapper } from '../../mappers/product.mapper';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import {
  FindProductsByNameQuery,
  FindProductsByNameQueryResult,
} from './find-products-by-name.query-handler';
import { ProductPaginatedResponseDto } from '../../dtos/product.paginated.response.dto';
import { ProductScalarFieldEnum } from '../../database/product.repository.prisma';
import { FindProductsByNameRequestDto } from './find-products-by-name.request.dto';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT}`,
)
@Controller(routesV1.version)
export class FindProductsByNameHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ProductMapper,
  ) {}

  @ApiOperation({ summary: 'Find Products by name' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductPaginatedResponseDto,
  })
  @ApiQuery({
    name: 'name',
    description: 'Tên sản phẩm',
    example: 'Nón len',
    required: true,
    type: String,
  })
  @Get(routesV1.productCatalog.product.productByName)
  async findProductsByName(
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
    queryParams: FindProductsByNameRequestDto,
    @Query('name') name: string,
  ): Promise<ProductPaginatedResponseDto> {
    const query = new FindProductsByNameQuery({
      ...queryParams.findOptions,
      name,
    });
    const result: FindProductsByNameQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new ProductPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
