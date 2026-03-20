import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service.js';
import type { Response } from 'express';
import { CurrentUser } from '../utils/decorators/current-user.decorator.js';
import { TypeGetSession } from '../types.js';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: { username: string; email: string; password: string },
    @Res() res: Response,
  ) {
    const result = await this.auth.signup(
      body.username,
      body.email,
      body.password,
    );

    return res.status(200).json({
      status: true,
      status_code: 200,
      message: 'Success sign up account',
      result,
    });
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const result = await this.auth.login(body.email, body.password);

      return res.status(200).json({
        status: true,
        status_code: 200,
        message: 'Success login account',
        result,
      });
    } catch (error) {
      console.log('Error in here');
      return res.status(500).json({
        status: false,
        status_code: 500,
        message: 'Internal Server Error',
        result: error,
      });
    }
  }

  @Get('session')
  getSession(@CurrentUser() user: TypeGetSession, @Res() res: Response) {
    return res.status(200).json({
      status: true,
      status_code: 200,
      message: 'Success get session',
      result: user,
    });
  }

  @Delete('logout')
  async logout(@Headers('authorization') auth: string, @Res() res: Response) {
    const token = auth?.replace('Bearer ', '');

    const result = await this.auth.logout(token);

    return res.status(200).json({
      status: true,
      status_code: 200,
      message: 'Success logout',
      result,
    });
  }
}
