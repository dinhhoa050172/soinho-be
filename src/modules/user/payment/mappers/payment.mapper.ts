import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/libs/ddd';
import { Payment as PaymentModel } from '@prisma/client';
import { PaymentEntity } from '../domain/payment.entity';
import { PaymentResponseDto } from '../dtos/payment.response.dto';

@Injectable()
export class PaymentMapper
  implements Mapper<PaymentEntity, PaymentModel, PaymentResponseDto>
{
  toPersistence(entity: PaymentEntity): PaymentModel {
    const copy = entity.getProps();
    const record: PaymentModel = {
      id: copy.id,
      // Map entity properties to record
      amount: copy.amount,
      description: copy.description || null,
      payUrl: copy.payUrl || null,
      status: copy.status,
      paymentMethodId: copy.paymentMethodId,
      orderId: copy.orderId,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: PaymentModel): PaymentEntity {
    return new PaymentEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        amount: record.amount,
        description: record.description || null,
        payUrl: record.payUrl || null,
        status: record.status,
        paymentMethodId: record.paymentMethodId,
        orderId: record.orderId,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: PaymentEntity): PaymentResponseDto {
    const props = entity.getProps();
    const response = new PaymentResponseDto(props);
    response.amount = props.amount;
    response.description = props.description || null;
    response.payUrl = props.payUrl || null;
    response.status = props.status || null;
    response.paymentMethodId = props.paymentMethodId.toString();
    response.orderId = props.orderId.toString();
    return response;
  }
}
