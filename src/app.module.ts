import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenController } from './controller/token.controller';
import { TokenService } from './service/token.service';
import { JwtService } from '@nestjs/jwt';
import { OtpController } from './controller/otp.controller';
import { OtpService } from './service/otp.service';
import { CustomerService } from './service/customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';
import { ConfigModule } from '@nestjs/config';

import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db-2all-free-backup.cmwyof2iqn6u.ap-southeast-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'Goodfood4goodlife',
      database: 'new-2all-dev',
      entities: [Customer],
      synchronize: false,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore as any,
        host: 'localhost',
        port: 6379,
        // ttl: 1000,
      }),
    }),
    TypeOrmModule.forFeature([Customer]),
  ],
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
