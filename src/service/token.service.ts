import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { GenericUser } from 'src/type';
import { CustomerService } from './customer.service';

const JWT_SECRET = {
  access_token: 'access_token_secret',
  refresh_token: 'refresh_token_secret',
};

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly customerService: CustomerService,
  ) {}
  public async createToken(user: GenericUser) {
    const data: JwtPayload = {
      ...user,
      sub: user.userId,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(data, {
        secret: JWT_SECRET.access_token,
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(data, {
        secret: JWT_SECRET.refresh_token,
        expiresIn: '30d',
      }),
    ]);
    return {
      ...data,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  async updateRefreshToken(user: GenericUser, refToken: string) {
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
  async validateJwtPayload(payload: JwtPayload) {
    switch (payload.userType) {
      case 'customer':
        return await this.customerService.findOneById(parseInt(payload.sub));
      case 'admin':
        break;
    }
  }
}
