import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenController } from './controller/token.controller';
import { TokenService } from './service/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [AppController, TokenController],
  providers: [AppService, TokenService, JwtService],
})
export class AppModule {}
