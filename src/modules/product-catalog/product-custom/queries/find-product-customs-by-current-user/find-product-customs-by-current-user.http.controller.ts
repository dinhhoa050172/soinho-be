import { Controller, HttpStatus, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { routesV1 } from 'src/configs/app.route';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { ProductCustomPaginatedResponseDto } from '../../dtos/product-custom.paginated.response.dto';
import { ProductCustomMapper } from '../../mappers/product-custom.mapper';
import {
  FindProductCustomsByCurrentUserQuery,
  FindProductCustomsByCurrentUserQueryResult,
} from './find-product-customs-by-current-user.query-handler';
import { FindProductCustomsByCurrentUserRequestDto } from './find-product-customs-by-current-user.request.dto';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT_CUSTOM}`,
)
@Controller(routesV1.version)
export class FindProductCustomsByCurrentUserHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: ProductCustomMapper,
  ) {}

  @ApiOperation({ summary: 'Find Product Customs by current user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductCustomPaginatedResponseDto,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Get(routesV1.productCatalog.productCustom.productCustomByCurrentUser)
  async findProductCustomsByCurrentUser(
    @Query(new DirectFilterPipe<any, Prisma.ProductCustomWhereInput>([]))
    queryParams: FindProductCustomsByCurrentUserRequestDto,
    @ReqUser() user: RequestUser,
  ): Promise<ProductCustomPaginatedResponseDto> {
    const query = new FindProductCustomsByCurrentUserQuery({
      ...queryParams.findOptions,
      userId: BigInt(user.id),
    });
    const result: FindProductCustomsByCurrentUserQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new ProductCustomPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
