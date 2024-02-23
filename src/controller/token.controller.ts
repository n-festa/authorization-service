import { Controller, HttpException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GeneralErrorResponse } from 'src/dto/general-error-response.dto';
import { GeneralServiceResponse } from 'src/dto/general-service-response.dto';
import { VerifyReCaptchaRequest } from 'src/dto/verify-recaptcha-request.dto';
import { VerifyReCaptchaResponse } from 'src/dto/verify-recaptcha-response.dto';
import { TokenService } from 'src/service/token.service';

@Controller()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern({ cmd: 'validate_jwt_payload' })
  public async validateJwtPayload(payload) {
    return await this.tokenService.validateJwtPayload(payload);
  }

  @MessagePattern({ cmd: 'refresh_token' })
  public async refreshToken(user) {
    return await this.tokenService.refreshToken(user);
  }

  @MessagePattern({ cmd: 'verify_recaptcha' })
  public async verifyReCaptcha(
    data: VerifyReCaptchaRequest,
  ): Promise<GeneralServiceResponse> {
    const res = new GeneralServiceResponse();
    const { verified_token } = data;
    try {
      const result: VerifyReCaptchaResponse =
        await this.tokenService.verifyReCaptchaFromEndPoint(verified_token);
      res.statusCode = 200;
      res.data = result;
    } catch (error) {
      if (error instanceof HttpException) {
        res.statusCode = error.getStatus();
        res.data = error.getResponse();
      } else {
        res.statusCode = 500;
        res.data = new GeneralErrorResponse(9, error.toString());
      }
    }
    return res;
  }
}
