import { Module } from '@nestjs/common';
import { payosConfig } from 'src/configs/payos.config';
import { PayosService } from './payos.service';
import PayOS from '@payos/node';

@Module({
  providers: [
    {
      provide: 'PAYOS_SDK',
      useValue: new PayOS(
        payosConfig.clientId,
        payosConfig.apiKey,
        payosConfig.checksumKey,
      ),
    },
    PayosService,
  ],
  exports: [PayosService],
})
export class PayosModule {}
