import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '../controllers/app.controller.js';
import { AuthModule } from './auth.module.js';
import { ScoreModule } from './score.module.js';
import { SessionMiddleware } from '../middleware/session.middleware.js';
import { PrismaService } from '../services/prisma.service.js';

@Module({
  imports: [AuthModule, ScoreModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
