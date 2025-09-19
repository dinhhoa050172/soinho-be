// import {
//   Controller,
//   Delete,
//   HttpCode,
//   HttpStatus,
//   NotFoundException as NotFoundHttpException,
//   Param,
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
// import { DeleteTransactionCommand } from './delete-transaction.command';
// import { DeleteTransactionServiceResult } from './delete-transaction.service';
// import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
// import { routesV1 } from 'src/configs/app.route';
// import { ApiErrorResponse } from 'src/libs/api/api-error.response';
// import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
// import { match } from 'oxide.ts';
// import { TransactionNotFoundError } from '../../domain/transaction.error';
// import { RoleGuard } from 'src/modules/auth/guards/role.guard';
// @ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.TRANSACTION}`)
// @Controller(routesV1.version)
// export class DeleteTransactionHttpController {
//   constructor(private readonly commandBus: CommandBus) {}

//   @ApiOperation({ summary: 'Delete a Transaction' })
//   @ApiBearerAuth()
//   @ApiParam({
//     name: 'id',
//     description: 'Transaction ID',
//     type: 'string',
//     required: true,
//     example: '1',
//   })
//   @ApiResponse({
//     status: HttpStatus.NO_CONTENT,
//     description: 'Transaction deleted',
//   })
//   @ApiResponse({
//     status: HttpStatus.NOT_FOUND,
//     description: TransactionNotFoundError.message,
//     type: ApiErrorResponse,
//   })
//   @UseGuards(AuthJwtGuard, RoleGuard)
//   @Delete(routesV1.user.transaction.delete)
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async delete(@Param('id') transactionId: bigint): Promise<void> {
//     const command = new DeleteTransactionCommand({ transactionId });
//     const result: DeleteTransactionServiceResult =
//       await this.commandBus.execute(command);

//     match(result, {
//       Ok: (isOk: boolean) => isOk,
//       Err: (error: Error) => {
//         if (error instanceof TransactionNotFoundError) {
//           throw new NotFoundHttpException({
//             message: error.message,
//             errorCode: error.code,
//           });
//         }

//         throw error;
//       },
//     });
//   }
// }
