import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/libs/ddd';
import { Order as OrderModel } from '@prisma/client';
import { Payment as PaymentModel } from '@prisma/client';
import { OrderEntity } from '../domain/order.entity';
import { OrderResponseDto } from '../dtos/order.response.dto';
import { PaymentResponseDto } from '../../payment/dtos/payment.response.dto';
import { PaymentEntity } from '../../payment/domain/payment.entity';

@Injectable()
export class OrderMapper
  implements Mapper<OrderEntity, OrderModel, OrderResponseDto>
{
  toPersistence(entity: OrderEntity): OrderModel {
    const copy = entity.getProps();
    const record: OrderModel = {
      id: copy.id,
      // Map entity properties to record
      totalAmount: copy.totalAmount,
      status: copy.status,
      shippingFullName: copy.shippingFullName,
      shippingPhone: copy.shippingPhone || null,
      shippingStreet: copy.shippingStreet,
      shippingWard: copy.shippingWard || null,
      shippingDistrict: copy.shippingDistrict || null,
      shippingProvince: copy.shippingProvince || null,
      shippingPostalCode: copy.shippingPostalCode || null,
      shippingCountry: copy.shippingCountry || 'Vietnam',
      userId: copy.userId,
      shippingId: copy.shippingId,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(
    record: OrderModel & {
      payment?: PaymentModel;
    },
  ): OrderEntity {
    return new OrderEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        totalAmount: record.totalAmount,
        status: record.status,
        shippingFullName: record.shippingFullName,
        shippingPhone: record.shippingPhone,
        shippingStreet: record.shippingStreet,
        shippingWard: record.shippingWard,
        shippingDistrict: record.shippingDistrict,
        shippingProvince: record.shippingProvince,
        shippingPostalCode: record.shippingPostalCode,
        shippingCountry: record.shippingCountry,
        userId: record.userId,
        shippingId: record.shippingId,
        payment: record.payment
          ? new PaymentEntity({
              id: record.payment.id,
              createdAt: record.payment.createdAt,
              updatedAt: record.payment.updatedAt,
              props: {
                // Map record properties to entity
                amount: record.payment.amount,
                description: record.payment.description || null,
                payUrl: record.payment.payUrl || null,
                status: record.payment.status,
                paymentMethodId: record.payment.paymentMethodId,
                orderId: record.payment.orderId,
                createdBy: record.payment.createdBy,
                updatedBy: record.payment.updatedBy,
              },
            })
          : undefined,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: OrderEntity): OrderResponseDto {
    const props = entity.getProps();
    const response = new OrderResponseDto(props);
    response.totalAmount = props.totalAmount;
    response.status = props.status;
    response.shippingFullName = props.shippingFullName;
    response.shippingPhone = props.shippingPhone || null;
    response.shippingStreet = props.shippingStreet;
    response.shippingWard = props.shippingWard || null;
    response.shippingDistrict = props.shippingDistrict || null;
    response.shippingProvince = props.shippingProvince || null;
    response.shippingPostalCode = props.shippingPostalCode || null;
    response.shippingCountry = props.shippingCountry || null;
    response.userId = props.userId.toString();
    response.shippingId = props.shippingId.toString();
    if (props.payment) {
      const paymentResponse = new PaymentResponseDto(props.payment);
      paymentResponse.amount = props.payment.getProps().amount;
      paymentResponse.description =
        props.payment.getProps().description || null;
      paymentResponse.payUrl = props.payment.getProps().payUrl || null;
      paymentResponse.status = props.payment.getProps().status || null;
      paymentResponse.paymentMethodId = props.payment
        .getProps()
        .paymentMethodId.toString();
      paymentResponse.orderId = props.payment.getProps().orderId.toString();
      response.payment = paymentResponse;
    }
    return response;
  }
}
