import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service.js';
import * as bcrypt from 'bcrypt';
import { SelectGetSession, TypeGetSession } from '../types.js';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private prisma: PrismaService,
  ) {}

  async signup(
    username: string,
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hash,
      },
    });

    const token: string = await this.tokenService.generateToken(
      Number(user.id),
      String(user.email),
    );

    await this.prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { token };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; id: number; username: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, String(user.password));

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token: string = await this.tokenService.generateToken(
      Number(user.id),
      String(user.email),
    );

    await this.prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { token, id: user.id, username: user.username };
  }

  async getSession(token: string): Promise<TypeGetSession> {
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

    return session.user as TypeGetSession;
  }

  async logout(token: string): Promise<TypeGetSession> {
    const result = await this.prisma.session.delete({
      where: {
        token,
      },
      select: {
        user: {
          select: SelectGetSession,
        },
      },
    });

    return result.user;
  }
}
