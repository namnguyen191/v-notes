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
  BoardDto,
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
import { ApiBoardService } from './api-board.service';
import { ApiTaskService } from './api-task.service';
import { BoardColumn } from './board-column.schema';

@WebSocketGateway({ cors: true })
@UseGuards(AuthWsGuard)
export class BoardSocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private _server!: Socket;

  constructor(
    private readonly _jwtService: JwtService,
    private readonly _boardColumnService: ApiBoardColumnService,
    private readonly _taskService: ApiTaskService,
    private readonly _boardService: ApiBoardService
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

  @SubscribeMessage(BoardSocketEvent.updateBoard)
  async handleUpdateBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: BoardSocketEventPayload<BoardSocketEvent.updateBoard>
  ): Promise<void> {
    const { boardId, newTitle } = payload;

    try {
      const updatedBoard = await this._boardService.updateById(
        boardId,
        newTitle
      );

      TypedEmit(this._server)(boardId, BoardSocketEvent.updateBoardSuccess, {
        board: serialize(updatedBoard, BoardDto)
      });
    } catch (error) {
      TypedEmit(this._server)(boardId, BoardSocketEvent.updateBoardFailure);
    }
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

  @SubscribeMessage(BoardSocketEvent.deleteBoard)
  async handleDeleteBoard(
    @MessageBody()
    payload: BoardSocketEventPayload<BoardSocketEvent.deleteBoard>
  ): Promise<void> {
    const { boardId } = payload;
    try {
      await this._boardService.deleteById(boardId);

      TypedEmit(this._server)('all', BoardSocketEvent.deleteBoardSuccess, {
        boardId
      });
    } catch (error) {
      this._server.to(boardId).emit(BoardSocketEvent.deleteBoardFailure);
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

  @SubscribeMessage(BoardSocketEvent.updateTask)
  async handleUpdateTask(
    @MessageBody()
    payload: BoardSocketEventPayload<BoardSocketEvent.updateTask>
  ): Promise<void> {
    const { newTitle, newDescription, newColumn, taskId, boardId } = payload;

    let newColumnToUpdateTo: BoardColumn | undefined = undefined;
    if (newColumn) {
      newColumnToUpdateTo = await this._boardColumnService.getById(
        newColumn as unknown as ObjectId
      );
    }

    try {
      const task = await this._taskService.updateById(taskId, {
        title: newTitle,
        description: newDescription,
        boardColumn: newColumnToUpdateTo
      });

      const updateTaskSuccessEventPayload: BoardSocketEventPayload<BoardSocketEvent.updateTaskSuccess> =
        {
          task: serialize(task, TaskDto)
        };

      TypedEmit(this._server)(
        boardId,
        BoardSocketEvent.updateTaskSuccess,
        updateTaskSuccessEventPayload
      );
    } catch (error) {
      TypedEmit(this._server)(boardId, BoardSocketEvent.updateTaskFailure);
    }
  }

  @SubscribeMessage(BoardSocketEvent.deleteTask)
  async handleDeleteTask(
    @MessageBody()
    payload: BoardSocketEventPayload<BoardSocketEvent.deleteTask>
  ): Promise<void> {
    const { taskId, boardId } = payload;

    try {
      await this._taskService.deleteById(taskId);

      TypedEmit(this._server)(boardId, BoardSocketEvent.deleteTaskSuccess, {
        taskId
      });
    } catch (error) {
      TypedEmit(this._server)(boardId, BoardSocketEvent.deleteTaskFailure);
    }
  }
}
