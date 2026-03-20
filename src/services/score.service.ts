import { Injectable } from '@nestjs/common';
import { Prisma } from '../types.js';
import { PrismaService } from './prisma.service.js';

type LeaderBoardType = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
    score: true;
  };
}>;

@Injectable()
export class ScoreService {
  constructor(private prisma: PrismaService) {}

  async getMyScore(user_id: number): Promise<number> {
    const result = await this.prisma.user.findFirst({
      where: {
        id: user_id,
      },
      select: {
        score: true,
      },
    });

    return result.score;
  }

  async updateMyScore(user_id: number, score: number): Promise<number> {
    const result = await this.prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        score: {
          increment: score,
        },
      },
      select: {
        score: true,
      },
    });

    return result.score;
  }

  async getLeaderBoard(): Promise<LeaderBoardType[]> {
    const result = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        score: true,
      },
    });

    return result;
  }
}
