import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Controller, HttpStatus, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { routesV1 } from 'src/configs/app.route';
import { ProductMapper } from '../../mappers/product.mapper';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { FindProductsRequestDto } from './find-products.request.dto';
import {
  FindProductsQuery,
  FindProductsQueryResult,
} from './find-products.query-handler';
import { ProductPaginatedResponseDto } from '../../dtos/product.paginated.response.dto';
import { ProductScalarFieldEnum } from '../../database/product.repository.prisma';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT}`,
)
@Controller(routesV1.version)
export class FindProductsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ProductMapper,
  ) {}

  @ApiOperation({ summary: 'Find Products' })
  @ApiQuery({
    name: 'category_name',
    description: 'Tên danh mục sản phẩm',
    example: 'Hoa Len',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'material_name',
    description: 'Tên vật liệu',
    example: 'Len Milk cotton',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductPaginatedResponseDto,
  })
  @Get(routesV1.productCatalog.product.root)
  async findProducts(
    @Query(
      new DirectFilterPipe<any, Prisma.ProductWhereInput>([
        ProductScalarFieldEnum.id,
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
    queryParams: FindProductsRequestDto,
    @Query('category_name') categoryName?: string,
    @Query('material_name') materialName?: string,
  ): Promise<ProductPaginatedResponseDto> {
    const query = new FindProductsQuery({
      ...queryParams.findOptions,
      categoryName,
      materialName,
    });
    const result: FindProductsQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new ProductPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
