import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Controller, HttpStatus, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { routesV1 } from 'src/configs/app.route';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { ProductCustomPaginatedResponseDto } from '../../dtos/product-custom.paginated.response.dto';
import { ProductCustomMapper } from '../../mappers/product-custom.mapper';
import {
  FindProductCustomsQuery,
  FindProductCustomsQueryResult,
} from './find-product-customs.query-handler';
import { FindProductCustomsRequestDto } from './find-product-customs.request.dto';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT_CUSTOM}`,
)
@Controller(routesV1.version)
export class FindProductCustomsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ProductCustomMapper,
  ) {}

  @ApiOperation({ summary: 'Find Product customs' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductCustomPaginatedResponseDto,
  })
  @Get(routesV1.productCatalog.productCustom.root)
  async findProductCustoms(
    @Query(new DirectFilterPipe<any, Prisma.ProductCustomWhereInput>([]))
    queryParams: FindProductCustomsRequestDto,
  ): Promise<ProductCustomPaginatedResponseDto> {
    const query = new FindProductCustomsQuery(queryParams.findOptions);
    const result: FindProductCustomsQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new ProductCustomPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
