import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenController } from './controller/token.controller';
import { TokenService } from './service/token.service';
import { JwtService } from '@nestjs/jwt';
import { OtpController } from './controller/otp.controller';
import { OtpService } from './service/otp.service';
import { CustomerService } from './service/customer.service';

@Module({
  imports: [],
  controllers: [AppController, TokenController, OtpController],
  providers: [
    AppService,
    TokenService,
    JwtService,
    OtpService,
    CustomerService,
  ],
})
export class AppModule {}
