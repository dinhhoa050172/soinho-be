/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, HttpStatus, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { routesV1 } from 'src/configs/app.route';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { MaterialPaginatedResponseDto } from '../../dtos/material.paginated.response.dto';
import { MaterialMapper } from '../../mappers/material.mapper';
import {
  FindMaterialsQuery,
  FindMaterialsQueryResult,
} from './find-materials.query-handler';
import { FindMaterialsRequestDto } from './find-materials.request.dto';
import { MaterialScalarFieldEnum } from '../../database/material.repository.prisma';
import { DirectFilterPipe } from '@chax-at/prisma-filter';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.MATERIAL}`,
)
@Controller(routesV1.version)
export class FindMaterialsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: MaterialMapper,
  ) {}

  @ApiOperation({ summary: 'Find Materials' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MaterialPaginatedResponseDto,
  })
  @Get(routesV1.productCatalog.material.root)
  async findMaterials(
    @Query(
      new DirectFilterPipe<any, Prisma.MaterialWhereInput>([
        MaterialScalarFieldEnum.id,
        MaterialScalarFieldEnum.name,
        MaterialScalarFieldEnum.unit,
        MaterialScalarFieldEnum.stockQty,
        MaterialScalarFieldEnum.thresholdQty,
        MaterialScalarFieldEnum.price,
        MaterialScalarFieldEnum.description,
      ]),
    )
    queryParams: FindMaterialsRequestDto,
  ): Promise<MaterialPaginatedResponseDto> {
    const query = new FindMaterialsQuery(queryParams.findOptions);
    const result: FindMaterialsQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new MaterialPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
