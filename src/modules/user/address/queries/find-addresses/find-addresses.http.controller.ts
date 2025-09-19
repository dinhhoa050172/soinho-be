/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, HttpStatus, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { routesV1 } from 'src/configs/app.route';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { AddressPaginatedResponseDto } from '../../dtos/address.paginated.response.dto';
import { AddressMapper } from '../../mappers/address.mapper';
import { AddressScalarFieldEnum } from '../../database/address.repository.prisma';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import {
  FindAddresssQuery,
  FindAddresssQueryResult,
} from './find-addresses.query-handler';
import { FindAddresssRequestDto } from './find-addresses.request.dto';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ADDRESS}`)
@Controller(routesV1.version)
export class FindAddresssHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: AddressMapper,
  ) {}

  @ApiOperation({ summary: 'Find Addresss' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: AddressPaginatedResponseDto,
  })
  @UseGuards(AuthJwtGuard)
  @Get(routesV1.user.address.root)
  async findAddresss(
    @ReqUser() user: RequestUser,
    @Query(
      new DirectFilterPipe<any, Prisma.AddressWhereInput>([
        AddressScalarFieldEnum.fullName,
        AddressScalarFieldEnum.phone,
        AddressScalarFieldEnum.street,
        AddressScalarFieldEnum.ward,
        AddressScalarFieldEnum.district,
        AddressScalarFieldEnum.province,
        AddressScalarFieldEnum.country,
        AddressScalarFieldEnum.postalCode,
        AddressScalarFieldEnum.isDefault,
      ]),
    )
    queryParams: FindAddresssRequestDto,
  ): Promise<AddressPaginatedResponseDto> {
    const query = new FindAddresssQuery(queryParams.findOptions, user.email);
    const result: FindAddresssQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new AddressPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
