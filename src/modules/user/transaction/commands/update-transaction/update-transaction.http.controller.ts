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
// import { TransactionEntity } from '../../domain/transaction.entity';
// import {
//   TransactionNotFoundError,
//   TransactionAlreadyInUseError,
// } from '../../domain/transaction.error';
// import { TransactionResponseDto } from '../../dtos/transaction.response.dto';
// import { TransactionMapper } from '../../mappers/transaction.mapper';
// import { UpdateTransactionCommand } from './update-transaction.command';
// import { RoleGuard } from 'src/modules/auth/guards/role.guard';
// import { UpdateTransactionRequestDto } from './update-transaction.request.dto';
// import { UpdateTransactionServiceResult } from './update-transaction.service';
// @ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.TRANSACTION}`)
// @Controller(routesV1.version)
// export class UpdateTransactionHttpController {
//   constructor(
//     private readonly commandBus: CommandBus,
//     private readonly mapper: TransactionMapper,
//   ) {}

//   @ApiOperation({ summary: 'Update a Transaction' })
//   @ApiBearerAuth()
//   @ApiParam({
//     name: 'id',
//     description: 'Transaction ID',
//     type: 'string',
//     required: true,
//     example: '1',
//   })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     type: TransactionResponseDto,
//   })
//   @ApiResponse({
//     status: HttpStatus.NOT_FOUND,
//     description: TransactionNotFoundError.message,
//     type: ApiErrorResponse,
//   })
//   @ApiResponse({
//     status: HttpStatus.BAD_REQUEST,
//     type: ApiErrorResponse,
//   })
//   @UseGuards(AuthJwtGuard, RoleGuard)
//   @Put(routesV1.user.transaction.update)
//   async update(
//     @ReqUser() user: RequestUser,
//     @Param('id') transactionId: bigint,
//     @Body() body: UpdateTransactionRequestDto,
//   ): Promise<TransactionResponseDto> {
//     const command = new UpdateTransactionCommand({
//       transactionId,
//       userEmail: user.email,
//       ...body,
//       updatedBy: user.email,
//     });

//     const result: UpdateTransactionServiceResult =
//       await this.commandBus.execute(command);

//     return match(result, {
//       Ok: (product: TransactionEntity) => this.mapper.toResponse(product),
//       Err: (error: Error) => {
//         if (error instanceof TransactionNotFoundError) {
//           throw new NotFoundHttpException({
//             message: error.message,
//             errorCode: error.code,
//           });
//         }
//         if (error instanceof TransactionAlreadyInUseError) {
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
