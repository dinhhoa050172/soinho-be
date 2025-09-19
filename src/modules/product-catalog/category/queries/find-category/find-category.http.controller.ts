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
  FindCategoryQuery,
  FindCategoryQueryResult,
} from './find-category.query-handler';
import { CategoryNotFoundError } from '../../domain/category.error';
import { CategoryResponseDto } from '../../dtos/category.response.dto';
import { CategoryMapper } from '../../mappers/category.mapper';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.CATEGORY}`,
)
@Controller(routesV1.version)
export class FindCategoryHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: CategoryMapper,
  ) {}

  @ApiOperation({ summary: 'Find one Category' })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CategoryNotFoundError.message,
    type: ApiErrorResponse,
  })
  @Get(routesV1.productCatalog.category.getOne)
  async findProduct(
    @Param('id') categoryId: bigint,
  ): Promise<CategoryResponseDto> {
    const query = new FindCategoryQuery(categoryId);
    const result: FindCategoryQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (category) => this.mapper.toResponse(category),
      Err: (error: Error) => {
        if (error instanceof CategoryNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
