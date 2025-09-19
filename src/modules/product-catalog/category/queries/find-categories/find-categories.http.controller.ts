import { Controller, HttpStatus, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { routesV1 } from 'src/configs/app.route';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { CategoryPaginatedResponseDto } from '../../dtos/category.paginated.response.dto';
import { CategoryMapper } from '../../mappers/category.mapper';
import {
  FindCategoriesQuery,
  FindCategoriesQueryResult,
} from './find-categories.query-handler';
import { FindCategoriesRequestDto } from './find-categories.request.dto';
import { CategoryScalarFieldEnum } from '../../database/category.repository.prisma';
import { DirectFilterPipe } from '@chax-at/prisma-filter';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.CATEGORY}`,
)
@Controller(routesV1.version)
export class FindCategoriesHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: CategoryMapper,
  ) {}

  @ApiOperation({ summary: 'Find Categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryPaginatedResponseDto,
  })
  @Get(routesV1.productCatalog.category.root)
  async findCategories(
    @Query(
      new DirectFilterPipe<any, Prisma.CategoryWhereInput>([
        CategoryScalarFieldEnum.id,
        CategoryScalarFieldEnum.name,
        CategoryScalarFieldEnum.desc,
      ]),
    )
    queryParams: FindCategoriesRequestDto,
  ): Promise<CategoryPaginatedResponseDto> {
    const query = new FindCategoriesQuery(queryParams.findOptions);
    const result: FindCategoriesQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new CategoryPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
