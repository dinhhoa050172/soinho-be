import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/libs/ddd';
import { Shipping as ShippingModel } from '@prisma/client';
import { ShippingEntity } from '../domain/shipping.entity';
import { ShippingResponseDto } from '../dtos/shipping.response.dto';

@Injectable()
export class ShippingMapper
  implements Mapper<ShippingEntity, ShippingModel, ShippingResponseDto>
{
  toPersistence(entity: ShippingEntity): ShippingModel {
    const copy = entity.getProps();
    const record: ShippingModel = {
      id: copy.id,
      trackingCode: copy.trackingCode || null,
      shippedAt: copy.shippedAt || null,
      deliveredAt: copy.deliveredAt || null,
      status: copy.status || 'CREATED',
      shippingMethodId: copy.shippingMethodId,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: ShippingModel): ShippingEntity {
    return new ShippingEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        trackingCode: record.trackingCode || undefined,
        shippedAt: record.shippedAt || undefined,
        deliveredAt: record.deliveredAt || undefined,
        status: record.status || 'CREATED',
        shippingMethodId: record.shippingMethodId,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: ShippingEntity): ShippingResponseDto {
    const props = entity.getProps();
    const response = new ShippingResponseDto(props);
    response.trackingCode = props.trackingCode;
    response.shippedAt = props.shippedAt;
    response.deliveredAt = props.deliveredAt;
    response.status = props.status || 'CREATED';
    response.shippingMethodId = props.shippingMethodId;
    return response;
  }
}
