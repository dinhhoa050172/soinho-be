import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from './libs/prisma/prisma.module';
import { databaseConfig } from './configs/database.config';
import { RequestContextModule } from 'nestjs-request-context';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from './libs/application/interceptor/exception.interceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/sa/user/user.module';
import { CacheModule } from './libs/cache/cache.module';
import { cacheConfig } from './configs/cache.config';
import { RoleModule } from './modules/sa/role/role.module';
import { MailerModule } from './libs/mailer/mailer.module';
import { CategoryModule } from './modules/product-catalog/category/category.module';
import { ProductModule } from './modules/product-catalog/product/product.module';
import { ProductImageModule } from './modules/product-catalog/product-image/product-image.module';
import { MaterialModule } from './modules/product-catalog/material/material.module';
import { SlugModule } from './libs/slug/slug.module';
import { AddressModule } from './modules/user/address/address.module';
import { CartModule } from './modules/user/cart/cart.module';
import { OrderItemModule } from './modules/user/order-item/order-item.module';
import { PaymentModule } from './modules/user/payment/payment.module';
import { OrderModule } from './modules/user/order/order.module';
import { PaymentMethodModule } from './modules/user/payment-method/payment-method.module';
import { ShippingModule } from './modules/user/shipping/shipping.module';
import { UserProfileModule } from './modules/user/user-profile/user-profile.module';
import { ProductCustomModule } from './modules/product-catalog/product-custom/product-custom.module';
import { TransactionModule } from './modules/user/transaction/transaction.module';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
  },
];

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CqrsModule,
    RequestContextModule,
    PrismaModule.forRootAsync({
      useFactory: () => ({
        isGlobal: true,
        databaseUrl: databaseConfig.databaseUrl,
      }),
    }),
    CacheModule.forRootAsync({
      useFactory: () => ({
        isGlobal: true,
        ...cacheConfig,
      }),
    }),
    MailerModule,
    SlugModule,
    PaymentModule,
    PaymentMethodModule,
    ShippingModule,
    AuthModule,
    UserModule,
    RoleModule,
    AddressModule,
    CategoryModule,
    MaterialModule,
    ProductModule,
    ProductImageModule,
    CartModule,
    OrderItemModule,
    OrderModule,
    UserProfileModule,
    ProductCustomModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [...interceptors],
})
export class AppModule {}
