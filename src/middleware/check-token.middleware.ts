import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../services/prisma.service.js';
import { SelectGetSession, TypeGetSession } from '../types.js';

@Injectable()
export class AuthGuardCustom implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const isOptional = this.reflector.getAllAndOverride<boolean>('isOptional', [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // ✅ PUBLIC → langsung lolos
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    // 🔥 OPTIONAL MODE
    if (isOptional) {
      if (!authHeader) {
        request.user = null;
        return true;
      }

      try {
        const token = authHeader.split(' ')[1];

        if (!token) {
          request.user = null;
          return true;
        }

        const session = await this.prisma.session.findUnique({
          where: { token },
          include: {
            user: {
              select: SelectGetSession,
            },
          },
        });

        if (!session || session.expiresAt < new Date()) {
          request.user = null;
          return true;
        }

        request.user = session.user as TypeGetSession;
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        request.user = null;
        return true;
      }
    }

    // 🔴 PROTECTED (default behavior kamu sekarang)
    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Invalid Token');
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

    request.user = session.user as TypeGetSession;

    if (requiredRoles && requiredRoles.length > 0) {
      const user = request.user;

      if (!user || !requiredRoles.includes(user.role as string)) {
        throw new UnauthorizedException(`Access denied (${user.role})`);
      }
    }

    return true;
  }
}
