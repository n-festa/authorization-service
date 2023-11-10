import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  public async createToken(phoneNumber: string) {
    const data: JwtPayload = {
      phoneNumber: phoneNumber,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(data, {
        secret: 'access_token_secret',
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(data, {
        secret: 'refresh_token_secret',
        expiresIn: '1d',
      }),
    ]);
    return {
      ...data,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
