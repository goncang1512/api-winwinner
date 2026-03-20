import { Prisma } from '../prisma/generated/client.js';
export { Prisma } from '../prisma/generated/client.js';

export type TypeGetSession = Prisma.UserGetPayload<{
  select: typeof SelectGetSession;
}>;

export const SelectGetSession = {
  id: true,
  username: true,
  email: true,
  createdAt: true,
  role: true,
  score: true,
};
