import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/libs/ddd';
import { OrderItem as OrderItemModel } from '@prisma/client';
import { OrderItemEntity } from '../domain/order-item.entity';
import { OrderItemResponseDto } from '../dtos/order-item.response.dto';

@Injectable()
export class OrderItemMapper
  implements Mapper<OrderItemEntity, OrderItemModel, OrderItemResponseDto>
{
  toPersistence(entity: OrderItemEntity): OrderItemModel {
    const copy = entity.getProps();
    const record: OrderItemModel = {
      id: copy.id,
      price: copy.price,
      unitPrice: copy.unitPrice,
      quantity: copy.quantity,
      orderId: copy.orderId,
      productId: copy.productId,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: OrderItemModel): OrderItemEntity {
    return new OrderItemEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        price: record.price,
        unitPrice: record.unitPrice,
        quantity: record.quantity,
        orderId: record.orderId,
        productId: record.productId,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: OrderItemEntity): OrderItemResponseDto {
    const props = entity.getProps();
    const response = new OrderItemResponseDto(props);
    response.price = props.price;
    response.unitPrice = props.unitPrice;
    response.quantity = props.quantity;
    response.orderId = props.orderId.toString();
    response.productId = props.productId.toString();
    return response;
  }
}
