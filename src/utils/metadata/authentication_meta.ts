import { SetMetadata } from '@nestjs/common';

// Authentication
export const IS_PUBLIC_KEY = 'isPublic';
export const AllowAnonymous = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_OPTIONAL_KEY = 'isOptional';
export const Optional = () => SetMetadata(IS_OPTIONAL_KEY, true);

// Roles Protect
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
