import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller.js';
import { AuthModule } from './auth.module.js';
import { ScoreModule } from './score.module.js';
import { PrismaService } from '../services/prisma.service.js';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuardCustom } from '../middleware/check-token.middleware.js';

@Module({
  imports: [AuthModule, ScoreModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuardCustom,
    },
    PrismaService,
  ],
})
export class AppModule {}
