import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
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
import { DeleteAddressCommand } from './delete-address.command';
import { DeleteAddressServiceResult } from './delete-address.service';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { match } from 'oxide.ts';
import { AddressNotFoundError } from '../../domain/address.error';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ADDRESS}`)
@Controller(routesV1.version)
export class DeleteAddressHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Delete a Address' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Address ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Address deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AddressNotFoundError.message,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Delete(routesV1.user.address.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') addressId: bigint): Promise<void> {
    const command = new DeleteAddressCommand({ addressId });
    const result: DeleteAddressServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof AddressNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
