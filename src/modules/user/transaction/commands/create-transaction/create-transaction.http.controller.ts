// import { match } from 'oxide.ts';
// import {
//   ConflictException as ConflictHttpException,
//   Body,
//   Controller,
//   HttpStatus,
//   Post,
//   UseGuards,
// } from '@nestjs/common';
// import { CommandBus } from '@nestjs/cqrs';
// import {
//   ApiBearerAuth,
//   ApiOperation,
//   ApiResponse,
//   ApiTags,
// } from '@nestjs/swagger';
// import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
// import { ReqUser } from 'src/libs/decorators/request-user.decorator';
// import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
// import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
// import { routesV1 } from 'src/configs/app.route';
// import { ApiErrorResponse } from 'src/libs/api/api-error.response';
// import { TransactionEntity } from '../../domain/transaction.entity';
// import { TransactionAlreadyExistsError } from '../../domain/transaction.error';
// import { TransactionResponseDto } from '../../dtos/transaction.response.dto';
// import { TransactionMapper } from '../../mappers/transaction.mapper';
// import { CreateTransactionCommand } from './create-transaction.command';
// import { CreateTransactionRequestDto } from './create-transaction.request.dto';
// import { CreateTransactionServiceResult } from './create-transaction.service';

// @ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.TRANSACTION}`)
// @Controller(routesV1.version)
// export class CreateTransactionHttpController {
//   constructor(
//     private readonly commandBus: CommandBus,
//     private readonly mapper: TransactionMapper,
//   ) {}

//   @ApiOperation({ summary: 'Create a Transaction' })
//   @ApiBearerAuth()
//   @ApiResponse({
//     status: HttpStatus.CREATED,
//     type: TransactionResponseDto,
//   })
//   @ApiResponse({
//     status: HttpStatus.BAD_REQUEST,
//     type: ApiErrorResponse,
//   })
//   @UseGuards(AuthJwtGuard)
//   @Post(routesV1.user.transaction.root)
//   async create(
//     @ReqUser() user: RequestUser,
//     @Body() body: CreateTransactionRequestDto,
//   ): Promise<TransactionResponseDto> {
//     const command = new CreateTransactionCommand({
//       userEmail: user.email,
//       ...body,
//       createdBy: user.email,
//     });

//     const result: CreateTransactionServiceResult =
//       await this.commandBus.execute(command);

//     return match(result, {
//       Ok: (user: TransactionEntity) => this.mapper.toResponse(user),
//       Err: (error: Error) => {
//         if (error instanceof TransactionAlreadyExistsError) {
//           throw new ConflictHttpException({
//             message: error.message,
//             errorCode: error.code,
//           });
//         }
//         throw error;
//       },
//     });
//   }
// }
