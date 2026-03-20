import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  async generateToken(userId: number, email: string): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
    });

    return String(token);
  }
}
