import { match } from 'oxide.ts';
import {
  ConflictException as ConflictHttpException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { AddressEntity } from '../../domain/address.entity';
import { AddressAlreadyExistsError } from '../../domain/address.error';
import { AddressResponseDto } from '../../dtos/address.response.dto';
import { AddressMapper } from '../../mappers/address.mapper';
import { CreateAddressCommand } from './create-address.command';
import { CreateAddressRequestDto } from './create-address.request.dto';
import { CreateAddressServiceResult } from './create-address.service';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ADDRESS}`)
@Controller(routesV1.version)
export class CreateAddressHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: AddressMapper,
  ) {}

  @ApiOperation({ summary: 'Create a Address' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AddressResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard)
  @Post(routesV1.user.address.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateAddressRequestDto,
  ): Promise<AddressResponseDto> {
    const command = new CreateAddressCommand({
      userEmail: user.email,
      ...body,
      createdBy: user.email,
    });

    const result: CreateAddressServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (user: AddressEntity) => this.mapper.toResponse(user),
      Err: (error: Error) => {
        if (error instanceof AddressAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
