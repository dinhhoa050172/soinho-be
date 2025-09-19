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
import { AddressNotFoundError } from '../../domain/address.error';
import { AddressResponseDto } from '../../dtos/address.response.dto';
import { AddressMapper } from '../../mappers/address.mapper';
import {
  FindAddressQuery,
  FindAddressQueryResult,
} from './find-address.query-handler';
@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ADDRESS}`)
@Controller(routesV1.version)
export class FindAddressHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: AddressMapper,
  ) {}

  @ApiOperation({ summary: 'Find one Address' })
  @ApiParam({
    name: 'id',
    description: 'Address ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AddressResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AddressNotFoundError.message,
    type: ApiErrorResponse,
  })
  @Get(routesV1.user.address.getOne)
  async findProduct(
    @Param('id') addressId: bigint,
  ): Promise<AddressResponseDto> {
    const query = new FindAddressQuery(addressId);
    const result: FindAddressQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (address) => this.mapper.toResponse(address),
      Err: (error: Error) => {
        if (error instanceof AddressNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
