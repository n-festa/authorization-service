import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TokenService } from 'src/service/token.service';

@Controller()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern({ cmd: 'create_token' })
  public async createToken(phoneNumber) {
    return await this.tokenService.createToken(phoneNumber);
  }
}
