import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { TypeGetSession } from '../types.js';
import { CurrentUser } from '../utils/decorators/current-user.decorator.js';
import { ScoreService } from '../services/score.service.js';

@Controller('score')
export class ScoreController {
  constructor(private scoreSrv: ScoreService) {}

  @Get('my-score')
  async getMyScore(@CurrentUser() user: TypeGetSession, @Res() res: Response) {
    try {
      const result = await this.scoreSrv.getMyScore(Number(user.id));
      return res.status(200).json({
        status: true,
        status_code: 200,
        messsage: 'Success get my score',
        result: result,
      });
    } catch (error) {
      return res.status(500).json({
        status: true,
        status_code: 500,
        messsage: 'Internal Server Error',
        result: error,
      });
    }
  }

  @Post('update-score')
  async updateMyScore(
    @CurrentUser() user: TypeGetSession,
    @Res() res: Response,
    @Body() body: { score: number },
  ) {
    try {
      const result = await this.scoreSrv.updateMyScore(
        Number(user.id),
        Number(body.score),
      );
      return res.status(200).json({
        status: true,
        status_code: 200,
        messsage: 'Success update my score',
        result: result,
      });
    } catch (error) {
      return res.status(500).json({
        status: true,
        status_code: 500,
        messsage: 'Internal Server Error',
        result: error,
      });
    }
  }

  @Get('leaderboard')
  async getLeaderboard(@Res() res: Response) {
    try {
      const result = await this.scoreSrv.getLeaderBoard();
      return res.status(200).json({
        status: true,
        status_code: 200,
        messsage: 'Success get leaderboard',
        result: result,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        status: true,
        status_code: 500,
        messsage: 'Internal Server Error',
        result: error,
      });
    }
  }
}
