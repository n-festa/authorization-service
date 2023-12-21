import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OtpService } from 'src/service/otp.service';
import { AuthenOtpRequest } from 'src/dto/authen-otp-request.dto';

@Controller()
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @MessagePattern({ cmd: 'request_otp' })
  public async requestOTP(phoneNumber: string) {
    return await this.otpService.requestOTP(phoneNumber);
  }

  @MessagePattern({ cmd: 'authenticate_otp' })
  public async authenticateOTP(data: AuthenOtpRequest) {
    return await this.otpService.authenticateOTP(
      data.phoneNumber,
      data.inputOTP,
    );
  }
}
