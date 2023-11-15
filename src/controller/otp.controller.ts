import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OtpService } from 'src/service/otp.service';

@Controller()
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @MessagePattern({ cmd: 'request_otp' })
  public async requestOTP(phoneNumber) {
    return await this.otpService.requestOTP(phoneNumber);
  }
}
