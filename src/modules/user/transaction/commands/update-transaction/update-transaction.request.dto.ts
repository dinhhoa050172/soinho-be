import { PartialType } from '@nestjs/swagger';
import { CreateTransactionRequestDto } from '../create-transaction/create-transaction.request.dto';

export class UpdateTransactionRequestDto extends PartialType(
  CreateTransactionRequestDto,
) {}
