import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { mailerConfig } from 'src/configs/mailer.config';
import { join } from 'path';

@Module({
  imports: [
    NestMailerModule.forRoot({
      transport: {
        host: mailerConfig.host,
        port: mailerConfig.port,
        secure: mailerConfig.port === 465,
        auth: {
          user: mailerConfig.user,
          pass: mailerConfig.pass,
        },
      },
      defaults: {
        from: `"Sợi Nhớ Handmade" <${mailerConfig.user}>`,
      },
      //   template: {
      //     dir: join(__dirname, './templates'),
      //     adapter: new HandlebarsAdapter(),
      //     options: {
      //       strict: true,
      //     },
      //   },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
