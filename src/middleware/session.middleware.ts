import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SelectGetSession, TypeGetSession } from '../types.js'; // sesuaikan
import { PrismaService } from '../services/prisma.service.js';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next();
      }

      // format: Bearer token
      const token = authHeader.split(' ')[1];

      if (!token) {
        return next();
      }

      const session = await this.prisma.session.findUnique({
        where: { token },
        include: {
          user: {
            select: SelectGetSession,
          },
        },
      });

      if (!session) {
        throw new UnauthorizedException('Session not found');
      }

      if (session.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired');
      }

      // inject user ke request
      req['user'] = session.user as TypeGetSession;

      next();
    } catch (error) {
      next(error);
    }
  }
}
