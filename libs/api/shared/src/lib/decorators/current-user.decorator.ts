import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { UserFromJwt } from '@v-notes/shared/api-interfaces';
import { AppRequest, AppWSClient } from '../types';

export const CurrentUser = createParamDecorator(
  (_data: never, ctx: ExecutionContext): UserFromJwt | null => {
    const request: AppRequest = ctx.switchToHttp().getRequest();
    if (!request.currentUser) {
      throw new UnauthorizedException();
    }

    return request.currentUser;
  }
);

export const CurrentUserWS = createParamDecorator(
  (_data: never, ctx: ExecutionContext): UserFromJwt | null => {
    const request: AppWSClient = ctx.switchToWs().getClient();
    if (!request.currentUser) {
      throw new UnauthorizedException();
    }

    return request.currentUser;
  }
);
