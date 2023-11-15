import { Injectable } from '@nestjs/common';
import { sendOTPSMS } from 'src/libs/thirpartyAPI.lib';
import { GeneralResponse } from 'src/dto/general-response.dto';
import { TokenService } from './token.service';
import { CustomerService } from './customer.service';
import { GenericUser } from 'src/type';

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
  constructor(
    private readonly tokenService: TokenService,
    private readonly customerService: CustomerService,
  ) {}
  private readonly otpBank: OtpType[] = [];
  async requestOTP(phoneNumber: string): Promise<GeneralResponse> {
    let result = new GeneralResponse(200, '');

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
    const otp: OtpType = {
      phoneNumber: phoneNumber,
      otpCode: otpInfo.OTP,
      created_at: otpInfo.created_at,
      expired_at: otpInfo.expired_at,
    };
    this.updateOtpBank(otp);

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

  async authenticateOTP(phoneNumber: string, inputOTP: string) {
    let result = new GeneralResponse(200, '');

    // Lấy currentOTP mới nhất của phoneNumber
    const currentOTP = this.getCurrentOTP(phoneNumber);
    if (currentOTP == null) {
      result.statusCode = 400;
      result.message = 'OTP không tồn tại';
      return result;
    }

    //Kiểm tra tính hiệu lực của current OTP
    const currentTime = Date.now();
    if (currentTime > currentOTP.expired_at) {
      result.statusCode = 400;
      result.message = 'OTP quá thời gian hiệu lực';
      return result;
    }

    //So sánh OTP gửi lên với currentOTP
    if (currentOTP.otpCode != inputOTP) {
      result.statusCode = 400;
      result.message = 'Sai OTP';
      return result;
    }

    //Clear Otp in otpBank
    this.deleteOtpBankByPhoneNumber(phoneNumber);

    //Check if there is any customer exists with the phone number
    //TODO
    let customer = await this.customerService.findOneByPhone(phoneNumber);
    if (!customer) {
      //create new customer if not exists
      customer = this.customerService.createCustomer(phoneNumber);
    }

    //Create token for the customer
    const user: GenericUser = {
      userType: 'customer',
      userId: '1', //will update later
      userName: phoneNumber,
      permissions: 'customer',
    };
    const tokenData = await this.tokenService.createToken(user);

    //update refresh token to user db
    this.updateRefreshToken(user, tokenData.refresh_token);

    result.statusCode = 200;
    result.message = tokenData;
    return result;
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

  getCurrentOTP(phoneNumber: string): OtpType {
    const currentOTP = this.otpBank.find(
      (otp) => otp.phoneNumber == phoneNumber,
    );
    if (currentOTP) return currentOTP;
    return null; //if not found
  }

  updateOtpBank(otp: OtpType) {
    if (this.getCurrentOTP(otp.phoneNumber) == null) {
      this.otpBank.push(otp);
      console.log('otpBank', this.otpBank);
      return this.otpBank;
    }
    //udpate otpBank with new otp
    for (let i = 0; i < this.otpBank.length; i++) {
      if (this.otpBank[i].phoneNumber == otp.phoneNumber) {
        this.otpBank[i] = otp;
        break;
      }
    }
    console.log('otpBank', this.otpBank);
    return this.otpBank;
  }
  deleteOtpBankByPhoneNumber(phoneNumber: string) {
    for (let i = 0; i < this.otpBank.length; i++) {
      if (this.otpBank[i].phoneNumber == phoneNumber) {
        this.otpBank.splice(i, 1);
        break;
      }
    }
    console.log('otpBank', this.otpBank);
    return this.otpBank;
  }
  private async updateRefreshToken(user: GenericUser, refToken: string) {
    switch (user.userType) {
      case 'customer':
        await this.customerService.updateRefreshTokenByPhone(
          user.userName,
          refToken,
        );
        break;
      case 'admin':
        break;
    }
  }
}
