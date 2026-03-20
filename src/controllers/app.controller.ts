import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { generateQuiz } from '../lib/generate-question.js';
import { CurrentUser } from '../utils/decorators/current-user.decorator.js';
import { TypeGetSession } from '../types.js';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(@Res() res: Response) {
    return res.status(200).json({
      status: true,
      status_code: 200,
      message: 'Sucess connect to API',
    });
  }

  @Get('question')
  async getQuestion(@CurrentUser() user: TypeGetSession, @Res() res: Response) {
    if (!user) {
      return res.status(403).json({
        status: false,
        status_code: 403,
        message: 'Unauthorization',
        result: null,
      });
    }

    try {
      const question = await generateQuiz();

      return res.status(200).json({
        status: true,
        status_code: 200,
        message: 'Success geenrate quiz',
        result: question,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        status_code: 500,
        message: 'Internal Server Error',
        result: error,
      });
    }
  }
}
