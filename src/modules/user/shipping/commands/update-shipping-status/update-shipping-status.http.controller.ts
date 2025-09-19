// import { match } from 'oxide.ts';

// import {
//   Body,
//   ConflictException,
//   Controller,
//   HttpStatus,
//   NotFoundException as NotFoundHttpException,
//   Param,
//   Put,
//   UseGuards,
// } from '@nestjs/common';
// import { CommandBus } from '@nestjs/cqrs';
// import {
//   ApiBearerAuth,
//   ApiOperation,
//   ApiParam,
//   ApiResponse,
//   ApiTags,
// } from '@nestjs/swagger';
// import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
// import { routesV1 } from 'src/configs/app.route';
// import { ApiErrorResponse } from 'src/libs/api/api-error.response';
// import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
// import { ReqUser } from 'src/libs/decorators/request-user.decorator';
// import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
// import { UpdateShippingStatusCommand } from './update-shipping-status.command';
// import { RoleGuard } from 'src/modules/auth/guards/role.guard';
// import { UpdateShippingStatusRequestDto } from './update-shipping-status.request.dto';
// import { UpdateShippingStatusServiceResult } from './update-shipping-status.service';
// import { ShippingMapper } from '../../mappers/shipping.mapper';
// import { ShippingAlreadyInUseError, ShippingNotFoundError } from '../../domain/shipping.error';
// import { ShippingResponseDto } from '../../dtos/shipping.response.dto';
// import { ShippingEntity } from '../../domain/shipping.entity';

// @ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.SHIPPING}`)
// @Controller(routesV1.version)
// export class UpdateShippingStatusHttpController {
//   constructor(
//     private readonly commandBus: CommandBus,
//     private readonly mapper: ShippingMapper,
//   ) {}

//   @ApiOperation({ summary: 'Update a Shipping' })
//   @ApiBearerAuth()
//   @ApiParam({
//     name: 'id',
//     description: 'Shipping ID',
//     type: 'string',
//     required: true,
//     example: '1',
//   })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     type: ShippingResponseDto,
//   })
//   @ApiResponse({
//     status: HttpStatus.NOT_FOUND,
//     description: ShippingNotFoundError.message,
//     type: ApiErrorResponse,
//   })
//   @ApiResponse({
//     status: HttpStatus.BAD_REQUEST,
//     type: ApiErrorResponse,
//   })
//   @UseGuards(AuthJwtGuard, RoleGuard)
//   @Put(routesV1.user.shipping.update)
//   async update(
//     @ReqUser() user: RequestUser,
//     @Param('id') ShippingId: bigint,
//     @Body() body: UpdateShippingStatusRequestDto,
//   ): Promise<ShippingResponseDto> {
//     const command = new UpdateShippingStatusCommand({
//       ShippingId,
//       ...body,
//       updatedBy: user.email,
//     });

//     const result: UpdateShippingStatusServiceResult =
//       await this.commandBus.execute(command);

//     return match(result, {
//       Ok: (product: ShippingEntity) => this.mapper.toResponse(product),
//       Err: (error: Error) => {
//         if (error instanceof ShippingNotFoundError) {
//           throw new NotFoundHttpException({
//             message: error.message,
//             errorCode: error.code,
//           });
//         }
//         if (error instanceof ShippingAlreadyInUseError) {
//           throw new ConflictException({
//             message: error.message,
//             errorCode: error.code,
//           });
//         }

//         throw error;
//       },
//     });
//   }
// }
