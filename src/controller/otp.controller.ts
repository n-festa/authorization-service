import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OtpService } from 'src/service/otp.service';
import { AuthenOtpRequest } from 'src/dto/AuthenOtpRequest.dto';

@Controller()
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @MessagePattern({ cmd: 'request_otp' })
  public async requestOTP(phoneNumber) {
    return await this.otpService.requestOTP(phoneNumber);
  }
  @MessagePattern({ cmd: 'authenticate_otp' })
  public authenticateOTP(data: AuthenOtpRequest) {
    return this.otpService.authenticateOTP(data.phoneNumber, data.inputOTP);
  }
}
