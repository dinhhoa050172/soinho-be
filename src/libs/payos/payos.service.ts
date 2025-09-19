import { Inject, Injectable } from '@nestjs/common';
import { PaymentGatewayPort } from '../ports/payment-gateway.port';
import { CheckoutRequestType, WebhookType } from '@payos/node/lib/type';
import { payosConfig } from 'src/configs/payos.config';

@Injectable()
export class PayosService implements PaymentGatewayPort {
  constructor(@Inject('PAYOS_SDK') private readonly payos: any) {}

  async createPaymentLink(
    orderCode: number,
    amount: number,
    desc = `Đơn hàng #${orderCode}`,
  ): Promise<string> {
    try {
      const body: CheckoutRequestType = {
        orderCode,
        amount,
        description: desc,
        returnUrl:
          payosConfig.returnUrl || 'http://localhost:3000/payment/success',
        cancelUrl:
          payosConfig.cancelUrl || 'http://localhost:3000/payment/cancel',
      };

      console.log(`Creating payment link for order ${orderCode}`);
      const res = await this.payos.createPaymentLink(body);
      return res.checkoutUrl;
    } catch (error) {
      console.error(`Failed to create payment link: ${error.message}`);
      throw error;
    }
  }

  verifyWebhook(data: WebhookType): boolean {
    return this.payos.verifyPaymentWebhookData(data).success;
  }

  getInfo(orderCode: number | string) {
    return this.payos.getPaymentLinkInformation(orderCode);
  }

  cancel(orderCode: number | string, reason = 'User cancel') {
    return this.payos.cancelPaymentLink(orderCode, reason);
  }
}
