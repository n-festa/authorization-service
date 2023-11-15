import { Injectable } from '@nestjs/common';
import { sendOTPSMS } from 'src/libs/thirpartyAPI.lib';

interface OtpType {
  phoneNumber: string;
  otpCode: string;
  created_at: number;
  expired_at: number;
}
interface VanillaOtpType {
  OTP: string;
  created_at: number;
  expired_at: number;
}

@Injectable()
export class OtpService {
  private readonly otpBank: OtpType[] = [];
  async requestOTP(phoneNumber: string) {
    let result: any = {
      statusCode: 200,
      message: '',
    };

    if (!phoneNumber) {
      result.statusCode = 400;
      result.message = 'phoneNumber is required';
      return result;
    }

    //validate phone format
    if (!this.validatePhone(phoneNumber)) {
      result.statusCode = 400;
      result.message = 'phoneNumber is invalid';
      return result;
    }

    //Tạo OTP cho phoneNumber
    const otpInfo: VanillaOtpType = this.createOTP();

    //Lưu thông tin OTP vừa tạo vào otpBank
    const otp = {
      phoneNumber: phoneNumber,
      otpCode: otpInfo.OTP,
      created_at: otpInfo.created_at,
      expired_at: otpInfo.expired_at,
    };
    this.otpBank.push(otp);

    // //Gửi SMS kèm OTP cho phoneNumber
    try {
      // const response = await sendOTPSMS(phoneNumber, otpInfo.OTP);
      const response = otp;
      result.statusCode = 200;
      result.message = response;
      return result;
    } catch (error) {
      result.statusCode = 500;
      result.message = error.toString();
      return result;
    }
  }
  //validatePhone
  validatePhone(phoneNumber) {
    //get only number from phoneNumber
    const validateHoneNumber = phoneNumber.replace(/\D/g, '');

    const length = validateHoneNumber.length;
    if (length < 11 || length > 12) return false;
    return true;
  }

  createOTP(): VanillaOtpType {
    const validTimeForOTP = 15 * 60 * 1000; //2 minutes
    const possible = '0123456789';

    let result: VanillaOtpType = { OTP: '', created_at: 0, expired_at: 0 };
    //generate OTP
    for (let i = 0; i < 6; i++) {
      result.OTP += possible.charAt(
        Math.floor(Math.random() * possible.length),
      );
    }

    const currentTimestamp = Date.now();
    result.created_at = currentTimestamp;
    result.expired_at = currentTimestamp + validTimeForOTP; //miliseconds

    return result;
  }
}
