import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { AppRequest } from '../types';
import { UserFromJwt } from '@v-notes/shared/api-interfaces';

export const CurrentUser = createParamDecorator(
  (_data: never, ctx: ExecutionContext): UserFromJwt | null => {
    const request: AppRequest = ctx.switchToHttp().getRequest();
    if (!request.currentUser) {
      throw new UnauthorizedException();
    }

    return request.currentUser;
  }
);
