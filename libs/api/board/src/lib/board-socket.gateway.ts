import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { AppWSClient, AuthWsGuard } from '@v-notes/api/shared';
import {
  BoardSocketEvent,
  BoardSocketEventPayload,
  ColumnDto,
  TaskDto,
  TypedEmit,
  UserFromJwt
} from '@v-notes/shared/api-interfaces';
import { serialize } from '@v-notes/shared/helpers';
import { ObjectId } from 'mongoose';
import { Socket } from 'socket.io';
import { ApiBoardColumnService } from './api-board-column.service';
import { ApiTaskService } from './api-task.service';

@WebSocketGateway({ cors: true })
@UseGuards(AuthWsGuard)
export class BoardSocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private _server!: Socket;

  constructor(
    private readonly _jwtService: JwtService,
    private readonly _boardColumnService: ApiBoardColumnService,
    private readonly _taskService: ApiTaskService
  ) {}

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

  @SubscribeMessage(BoardSocketEvent.createColumn)
  async handleCreateColumn(
    @MessageBody()
    payload: BoardSocketEventPayload<BoardSocketEvent.createColumn>
  ): Promise<void> {
    const { boardId, columnTitle } = payload;
    const column = await this._boardColumnService.create({
      boardId: boardId as unknown as ObjectId,
      title: columnTitle
    });

    const createBoardSuccessEventPayload: BoardSocketEventPayload<BoardSocketEvent.createColumnSuccess> =
      {
        column: serialize(column, ColumnDto)
      };
    this._server
      .to(boardId)
      .emit(
        BoardSocketEvent.createColumnSuccess,
        createBoardSuccessEventPayload
      );
  }

  @SubscribeMessage(BoardSocketEvent.updateColumn)
  async handleUpdateColumn(
    @MessageBody()
    payload: BoardSocketEventPayload<BoardSocketEvent.updateColumn>
  ): Promise<void> {
    const { columnId, columnTitle, boardId } = payload;
    try {
      const column = await this._boardColumnService.updateById({
        id: columnId,
        fieldsToUpdate: { title: columnTitle }
      });

      const updateColumnSuccessEventPayload: BoardSocketEventPayload<BoardSocketEvent.updateColumnSuccess> =
        {
          column: serialize(column, ColumnDto)
        };

      this._server
        .to(boardId)
        .emit(
          BoardSocketEvent.updateColumnSuccess,
          updateColumnSuccessEventPayload
        );
    } catch (error) {
      this._server.to(boardId).emit(BoardSocketEvent.updateColumnFailure);
    }
  }

  @SubscribeMessage(BoardSocketEvent.deleteColumn)
  async handleDeleteColumn(
    @MessageBody()
    payload: BoardSocketEventPayload<BoardSocketEvent.deleteColumn>
  ): Promise<void> {
    const { columnId, boardId } = payload;
    try {
      await this._boardColumnService.deleteById(columnId);

      TypedEmit(this._server)(boardId, BoardSocketEvent.deleteColumnSuccess, {
        columnId
      });
    } catch (error) {
      this._server.to(boardId).emit(BoardSocketEvent.deleteColumnFailure);
    }
  }

  @SubscribeMessage(BoardSocketEvent.createTask)
  async handleCreateTask(
    @MessageBody()
    payload: BoardSocketEventPayload<BoardSocketEvent.createTask>
  ): Promise<void> {
    const { title, columnId, boardId } = payload;

    const task = await this._taskService.create({
      title,
      columnId: columnId as unknown as ObjectId
    });

    const createTaskSuccessEventPayload: BoardSocketEventPayload<BoardSocketEvent.createTaskSuccess> =
      {
        task: serialize(task, TaskDto)
      };

    this._server
      .to(boardId)
      .emit(BoardSocketEvent.createTaskSuccess, createTaskSuccessEventPayload);
  }
}
