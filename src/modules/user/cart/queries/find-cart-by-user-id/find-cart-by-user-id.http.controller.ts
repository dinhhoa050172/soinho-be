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
import { CartNotFoundError } from '../../domain/cart.error';
import { CartResponseDto } from '../../dtos/cart.response.dto';
import { CartMapper } from '../../mappers/cart.mapper';
import {
  FindCartByUserIdQuery,
  FindCartByUserIdQueryResult,
} from './find-cart-by-user-id.query-handler';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.CART}`)
@Controller(routesV1.version)
export class FindCartByUserIdHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: CartMapper,
  ) {}

  @ApiOperation({ summary: 'Find cart by user id' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CartResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CartNotFoundError.message,
    type: ApiErrorResponse,
  })
  @Get(routesV1.user.cart.getOne)
  async findCartByUserId(
    @Param('id') userId: bigint,
  ): Promise<CartResponseDto> {
    const query = new FindCartByUserIdQuery(userId);
    const result: FindCartByUserIdQueryResult =
      await this.queryBus.execute(query);

    return match(result, {
      Ok: (address) => this.mapper.toResponse(address),
      Err: (error: Error) => {
        if (error instanceof CartNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
