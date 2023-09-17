import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { UserFromJwt } from '@v-notes/shared/api-interfaces';
import { AppWSClient } from '../types';

@Injectable()
export class AuthWsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: AppWSClient = context.switchToWs().getClient();
    const token = extractAuthTokenFromClient(client);
    if (!token) {
      client.disconnect();
      throw new WsException('Unauthorized');
    }
    try {
      const payload = await this.jwtService.verifyAsync<UserFromJwt>(token);
      client.currentUser = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}

const extractAuthTokenFromClient = (
  client: AppWSClient
): string | undefined => {
  const authToken = client.handshake.auth['token'];

  return authToken;
};
