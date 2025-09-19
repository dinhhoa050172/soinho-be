import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { mailerConfig } from 'src/configs/mailer.config';

@Injectable()
export class MailerService {
  private readonly verificationUrlBase: string;
  private readonly resetPasswordUrlBase: string;

  constructor(private readonly mailerService: NestMailerService) {
    this.verificationUrlBase = mailerConfig.verificationUrl;
    this.resetPasswordUrlBase = mailerConfig.verificationUrl;
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `${this.verificationUrlBase}${token}`;
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Xác thực tài khoản Sợi Nhớ Handmade',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #c47b6e;">Chào bạn,</h2>
              <p>
                Cảm ơn bạn đã đăng ký tài khoản tại <strong>Sợi Nhớ Handmade</strong> —
                nơi lưu giữ những sản phẩm thủ công đầy yêu thương.
              </p>
              <p>
                Để hoàn tất quá trình đăng ký, vui lòng xác thực địa chỉ email của bạn
                bằng cách nhấn vào nút bên dưới:
              </p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="
                  background-color: #c47b6e;
                  color: white;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                  display: inline-block;
                ">
                  Xác thực tài khoản
                </a>
              </p>
              <p>
                Hoặc bạn cũng có thể sao chép và dán đường dẫn sau vào trình duyệt:
                <br/>
                <a href="${verificationUrl}" style="color: #c47b6e;">${verificationUrl}</a>
              </p>
              <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
              <p style="font-size: 14px; color: #777;">
                Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.
              </p>
              <p style="font-size: 14px; color: #777;">
                Trân trọng,<br/>
                Đội ngũ <strong>Sợi Nhớ Handmade</strong>
              </p>
            </div>
          `,

        // template: 'verification',
        // context: {
        //   email: to,
        //   verificationUrl,
        // },
      });
    } catch (error) {
      console.error('Gửi email thất bại:', error);
      throw new InternalServerErrorException('Không thể gửi email xác thực.');
    }
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const resetPasswordUrl = `${this.resetPasswordUrlBase}${token}`;
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Đặt lại mật khẩu - Sợi Nhớ Handmade',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #c47b6e;">Xin chào,</h2>
          <p>
            Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu từ bạn tại <strong>Sợi Nhớ Handmade</strong>.
          </p>
          <p>
            Nếu bạn là người thực hiện yêu cầu này, vui lòng nhấn vào nút bên dưới để tạo mật khẩu mới:
          </p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetPasswordUrl}" style="
              background-color: #c47b6e;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              display: inline-block;
            ">
              Đặt lại mật khẩu
            </a>
          </p>
          <p>
            Hoặc bạn cũng có thể sao chép và dán đường dẫn sau vào trình duyệt:
            <br/>
            <a href="${resetPasswordUrl}" style="color: #c47b6e;">${resetPasswordUrl}</a>
          </p>
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 14px; color: #777;">
            Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.
          </p>
          <p style="font-size: 14px; color: #777;">
            Trân trọng,<br/>
            Đội ngũ <strong>Sợi Nhớ Handmade</strong>
          </p>
        </div>
      `,
      });
    } catch (error) {
      console.error('Gửi email đặt lại mật khẩu thất bại:', error);
      throw new InternalServerErrorException(
        'Không thể gửi email đặt lại mật khẩu.',
      );
    }
  }
}
