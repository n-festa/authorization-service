import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { GenericUser } from 'src/type';

const JWT_SECRET = {
  access_token: 'access_token_secret',
  refresh_token: 'refresh_token_secret',
};

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
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
  // private async updateRefreshToken(email: string, refToken: string) {
  //   await this.usersService.updateRefreshTokenByEmail(email, refToken);
  // }
}
