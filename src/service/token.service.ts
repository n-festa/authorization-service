import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as MyLib from 'src/libs';
import { GenericUser } from 'src/type';
import { CustomerService } from './customer.service';
import { Role, UserType } from 'src/enum';
import { GeneralResponse } from 'src/dto/general-response.dto';
import {
  JWT_LIFETIME_ACCESS_TOKEN,
  JWT_LIFETIME_REFRESH_TOKEN,
  JWT_SECRET_ACCESS_TOKEN,
  JWT_SECRET_REFRESH_TOKEN,
} from 'src/app.constants';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly customerService: CustomerService,
  ) {}
  public async createToken(user: GenericUser) {
    const data: JwtPayload = {
      ...user,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(data, {
        secret: JWT_SECRET_ACCESS_TOKEN,
        expiresIn: JWT_LIFETIME_ACCESS_TOKEN,
      }),
      this.jwtService.signAsync(data, {
        secret: JWT_SECRET_REFRESH_TOKEN,
        expiresIn: JWT_LIFETIME_REFRESH_TOKEN,
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
      case UserType.Customer:
        await this.customerService.updateRefreshTokenByPhone(
          user.userName,
          refToken,
        );
        break;
      case UserType.Admin:
        break;
      case UserType.RestaurantOwner:
        break;
    }
  }
  async validateJwtPayload(payload: JwtPayload) {
    switch (payload.userType) {
      case UserType.Customer:
        return await this.customerService.findOneById(payload.userId);
      case UserType.Admin:
        break;
      case UserType.RestaurantOwner:
        break;
    }
  }
  public async refreshToken(user: any) {
    const { userId, refresh_token, userType } = user;
    let result = new GeneralResponse(200, '');

    if (userType == UserType.Customer) {
      const customer = await this.customerService.findOneById(userId);
      if (!customer) {
        result.statusCode = 403;
        result.message = 'User not found';
        return result;
      }
      // const isMatchFound = bcrypt.compareSync(
      //   refresh_token,
      //   customer.refresh_token,
      // );
      const isMatchFound = MyLib.compareHashString(
        refresh_token,
        customer.refresh_token,
      );

      if (!isMatchFound) {
        result.statusCode = 403;
        result.message = 'The refresh token is incorrect';
        return result;
      }
      const user: GenericUser = {
        userType: UserType.Customer,
        userId: customer.customer_id,
        userName: customer.phone_number,
        permissions: Role.Customer,
      };
      const tokenData = await this.createToken(user);
      this.updateRefreshToken(user, tokenData.refresh_token);

      result.statusCode = 200;
      result.message = tokenData;
      return result;
    }
  }
}
