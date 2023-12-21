import { Inject, Injectable } from '@nestjs/common';
import { GeneralResponse } from 'src/dto/general-response.dto';
import { TokenService } from './token.service';
import { CustomerService } from './customer.service';
import { GenericUser } from 'src/type';
import { Role, UserType } from 'src/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private readonly OTP_TTL_IN_MILLISECOND: number = 2 * 60 * 1000;
  async requestOTP(phoneNumber: string): Promise<GeneralResponse> {
    const result = new GeneralResponse(200, '');

    if (!phoneNumber) {
      //TO DO: to define a good schema/pipeline that can handle and return result/error to the api gateway
      result.statusCode = 400;
      result.message = 'PhoneNumber is required';
      return result;
    }

    // Generate OTP
    const otpInfo: VanillaOtpType = this.createOTP();

    //Lưu thông tin OTP vừa tạo vào otpBank
    const otp: OtpType = {
      phoneNumber: phoneNumber,
      otpCode: otpInfo.OTP,
      created_at: otpInfo.created_at,
      expired_at: otpInfo.expired_at,
    };

    await this.updateOtpBank(otp);

    // Sms sending
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
    const result = new GeneralResponse(200, '');
    try {
      const currentOTP = await this.cacheManager.get(phoneNumber);

      if (!currentOTP || currentOTP !== inputOTP) {
        result.statusCode = 400;
        result.message = 'OTP is invalid or expired';
        return result;
      }

      //Clear Otp in cache
      await this.deleteOtpBankByPhoneNumber(phoneNumber);

      //create customer if it does not exist
      const customer = await this.customerService.createCustomer(phoneNumber);

      //Create token for the customer
      const user: GenericUser = {
        userType: UserType.Customer,
        userId: customer.customer_id,
        userName: customer.phone_number,
        permissions: Role.Customer,
      };
      const tokenData = await this.tokenService.createToken(user);

      //update refresh token to user db
      await this.tokenService.updateRefreshToken(user, tokenData.refresh_token);

      result.statusCode = 200;
      result.message = tokenData;
      return result;
    } catch (error) {
      console.log(error);
      result.statusCode = 500;
      result.message = error.toString();
      return result;
    }
  }

  //validatePhone
  validatePhone(phoneNumber: string) {
    //get only number from phoneNumber
    const validateHoneNumber = phoneNumber.replace(/\D/g, '');

    const length = validateHoneNumber.length;
    if (length < 11 || length > 12) return false;
    return true;
  }

  createOTP(): VanillaOtpType {
    const possible = '0123456789';

    const result: VanillaOtpType = { OTP: '', created_at: 0, expired_at: 0 };

    //generate OTP
    for (let i = 0; i < 6; i++) {
      result.OTP += possible.charAt(
        Math.floor(Math.random() * possible.length),
      );
    }

    const currentTimestamp = Date.now();
    // TO DO: Eliminate created_at,expired_at. Tuanvo thinks it is redundant.
    result.created_at = currentTimestamp;
    result.expired_at = currentTimestamp + this.OTP_TTL_IN_MILLISECOND; // miliseconds

    return result;
  }

  async updateOtpBank(otp: OtpType) {
    const storedOTP = this.cacheManager.get(otp.phoneNumber);
    if (storedOTP) {
      await this.cacheManager.del(otp.phoneNumber);
    }
    await this.cacheManager.set(
      otp.phoneNumber,
      otp.otpCode,
      this.OTP_TTL_IN_MILLISECOND,
    );
  }
  async deleteOtpBankByPhoneNumber(phoneNumber: string) {
    await this.cacheManager.del(phoneNumber);
  }
}
