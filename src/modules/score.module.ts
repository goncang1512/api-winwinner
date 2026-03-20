import { Module } from '@nestjs/common';
import { ScoreController } from '../controllers/score.controller.js';
import { ScoreService } from '../services/score.service.js';
import { PrismaService } from '../services/prisma.service.js';

@Module({
  controllers: [ScoreController],
  providers: [ScoreService, PrismaService],
})
export class ScoreModule {}
