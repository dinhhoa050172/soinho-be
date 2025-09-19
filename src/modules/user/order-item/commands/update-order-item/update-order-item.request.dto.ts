import { PartialType } from '@nestjs/swagger';
import { CreateOrderItemRequestDto } from '../create-order-item/create-order-item.request.dto';

export class UpdateOrderItemRequestDto extends PartialType(
  CreateOrderItemRequestDto,
) {}
