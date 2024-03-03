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
// import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db-2all-free.c9s4w6ey6i0r.ap-southeast-1.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'Goodfood4goodlife',
      database: 'new-2all-dev',
      entities: [Customer],
      synchronize: false,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        // store: redisStore,
        // url: 'redis://localhost:6379',
        // ttl: 1000,
      }),
    }),
    TypeOrmModule.forFeature([Customer]),
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
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
