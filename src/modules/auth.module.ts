import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller.js';
import { TokenService } from '../services/token.service.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service.js';
import { PrismaService } from '../services/prisma.service.js';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SUPER_SECRET',
    }),
  ],
  controllers: [AuthController],
  providers: [TokenService, AuthService, PrismaService],
})
export class AuthModule {}
