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
import {
  FindMaterialQuery,
  FindMaterialQueryResult,
} from './find-material.query-handler';
import { MaterialNotFoundError } from '../../domain/material.error';
import { MaterialResponseDto } from '../../dtos/material.response.dto';
import { MaterialMapper } from '../../mappers/material.mapper';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.MATERIAL}`,
)
@Controller(routesV1.version)
export class FindMaterialHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: MaterialMapper,
  ) {}

  @ApiOperation({ summary: 'Find one Material' })
  @ApiParam({
    name: 'id',
    description: 'Material ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MaterialResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: MaterialNotFoundError.message,
    type: ApiErrorResponse,
  })
  @Get(routesV1.productCatalog.material.getOne)
  async findProduct(
    @Param('id') materialId: bigint,
  ): Promise<MaterialResponseDto> {
    const query = new FindMaterialQuery(materialId);
    const result: FindMaterialQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (material) => this.mapper.toResponse(material),
      Err: (error: Error) => {
        if (error instanceof MaterialNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
