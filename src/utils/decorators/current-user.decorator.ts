import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { TypeGetSession } from '../../types.js';

interface RequestWithUser extends Request {
  user?: TypeGetSession;
}

export const CurrentUser = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();

  const user = request.user;

  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return data ? user[data] : user;
});
