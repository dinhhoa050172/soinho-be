import { match } from 'oxide.ts';

import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { AddressEntity } from '../../domain/address.entity';
import {
  AddressNotFoundError,
  AddressAlreadyInUseError,
} from '../../domain/address.error';
import { AddressResponseDto } from '../../dtos/address.response.dto';
import { AddressMapper } from '../../mappers/address.mapper';
import { UpdateAddressCommand } from './update-address.command';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { UpdateAddressRequestDto } from './update-address.request.dto';
import { UpdateAddressServiceResult } from './update-address.service';
@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ADDRESS}`)
@Controller(routesV1.version)
export class UpdateAddressHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: AddressMapper,
  ) {}

  @ApiOperation({ summary: 'Update a Address' })
  @ApiBearerAuth()
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Put(routesV1.user.address.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') addressId: bigint,
    @Body() body: UpdateAddressRequestDto,
  ): Promise<AddressResponseDto> {
    const command = new UpdateAddressCommand({
      addressId,
      userEmail: user.email,
      ...body,
      updatedBy: user.email,
    });

    const result: UpdateAddressServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (product: AddressEntity) => this.mapper.toResponse(product),
      Err: (error: Error) => {
        if (error instanceof AddressNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof AddressAlreadyInUseError) {
          throw new ConflictException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
