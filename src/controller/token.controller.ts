import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
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
}
