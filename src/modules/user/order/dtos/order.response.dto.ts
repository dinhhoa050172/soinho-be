import { Prisma, StatusOrder } from '@prisma/client';
import { ResponseBase } from 'src/libs/api/response.base';
import { PaymentResponseDto } from '../../payment/dtos/payment.response.dto';

export class OrderResponseDto extends ResponseBase<any> {
  totalAmount: Prisma.Decimal;
  status: StatusOrder;
  shippingFullName: string;
  shippingPhone?: string | null;
  shippingStreet: string;
  shippingWard?: string | null;
  shippingDistrict?: string | null;
  shippingProvince?: string | null;
  shippingPostalCode?: string | null;
  shippingCountry?: string | null;
  userId: string;
  paymentId: string;
  shippingId: string;
  payment?: PaymentResponseDto;
}
