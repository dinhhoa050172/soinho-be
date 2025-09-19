// import {
//   Controller,
//   Post,
//   Body,
//   BadRequestException,
//   HttpStatus,
// } from '@nestjs/common';
// import { CommandBus } from '@nestjs/cqrs';
// import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { Result, match } from 'oxide.ts';
// import { ForgotPasswordCommand } from './forgot-password.command';
// import { ForgotPasswordRequestDto } from './forgot-password.request.dto';
// import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
// import { ApiErrorResponse } from 'src/libs/api/api-error.response';
// import { routesV1 } from 'src/configs/app.route';

// @ApiTags(API_V1_TAGS.AUTHENTICATION)
// @Controller(routesV1.version)
// export class ForgotPasswordHttpController {
//   constructor(private readonly commandBus: CommandBus) {}

//   @ApiOperation({
//     summary: 'ForgotPassword',
//     description: 'input email and password to ForgotPassword',
//   })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     type: ForgotPasswordResponseDto,
//   })
//   @ApiResponse({
//     status: HttpStatus.BAD_REQUEST,
//     description: ForgotPasswordError.name,
//     type: ApiErrorResponse,
//   })
//   @Post(routesV1.auth.ForgotPassword)
//   async ForgotPassword(
//     @Body() body: ForgotPasswordRequestDto,
//   ): Promise<ForgotPasswordResponseDto> {
//     const command = new ForgotPasswordCommand(body);

//     const result: Result<ForgotPasswordResponseDto, ForgotPasswordError> =
//       await this.commandBus.execute(command);

//     return match(result, {
//       Ok: (data: ForgotPasswordResponseDto) => data,
//       Err: (error: Error) => {
//         if (error instanceof ForgotPasswordError) {
//           throw new BadRequestException({
//             message: error.message,
//             errorCode: error.code,
//           });
//         }
//         throw error;
//       },
//     });
//   }
// }
