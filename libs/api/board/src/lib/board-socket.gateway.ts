import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets';
import { AppWSClient, AuthWsGuard } from '@v-notes/api/shared';
import {
  BoardSocketEvent,
  BoardSocketEventPayload,
  UserFromJwt
} from '@v-notes/shared/api-interfaces';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
@UseGuards(AuthWsGuard)
export class BoardSocketGateway implements OnGatewayConnection {
  constructor(private readonly _jwtService: JwtService) {}

  async handleConnection(client: AppWSClient) {
    const authToken = client.handshake.auth['token'];

    if (!authToken) {
      Logger.error(`Unauthorized connection`);
      client.disconnect();
      return;
    }

    try {
      const user = await this._jwtService.verifyAsync<UserFromJwt>(authToken);
      client.currentUser = user;
    } catch {
      Logger.error(`Unauthorized connection`);
      client.disconnect();
    }
  }

  @SubscribeMessage(BoardSocketEvent.joinBoard)
  handleJoinBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: BoardSocketEventPayload<BoardSocketEvent.joinBoard>
  ): void {
    client.join(payload.boardId);
  }

  @SubscribeMessage(BoardSocketEvent.leaveBoard)
  handleLeaveBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: BoardSocketEventPayload<BoardSocketEvent.leaveBoard>
  ): void {
    client.leave(payload.boardId);
  }
}
