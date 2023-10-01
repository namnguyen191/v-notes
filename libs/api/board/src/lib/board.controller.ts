import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { AuthGuard, CurrentUser } from '@v-notes/api/shared';
import {
  BoardDto,
  ColumnDto,
  CreateBoardColumnParams,
  CreateBoardColumnRequestBody,
  CreateBoardRequestBody,
  GetAllBoardsResponse,
  GetBoardByIdParams,
  GetBoardByTitleResponse,
  GetBoardColumnParams,
  GetBoardColumnsResponse,
  GetColumnTaskParams,
  TaskDto,
  UserFromJwt
} from '@v-notes/shared/api-interfaces';
import { serialize } from '@v-notes/shared/helpers';
import { ObjectId } from 'mongoose';
import { ApiBoardColumnService } from './api-board-column.service';
import { ApiBoardService } from './api-board.service';
import { ApiTaskService } from './api-task.service';

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardController {
  constructor(
    private readonly boardService: ApiBoardService,
    private readonly boardColumnService: ApiBoardColumnService,
    private readonly taskService: ApiTaskService
  ) {}

  @Post()
  async createBoard(
    @CurrentUser() user: UserFromJwt,
    @Body() body: CreateBoardRequestBody
  ): Promise<BoardDto> {
    const { title } = body;
    const board = await this.boardService.create({
      title,
      useremail: user.email
    });

    const serializedBoard = serialize(board, BoardDto);

    return serializedBoard;
  }

  @Post(':boardId/columns')
  async createColumn(
    @CurrentUser() user: UserFromJwt,
    @Body() body: CreateBoardColumnRequestBody,
    @Param() params: CreateBoardColumnParams
  ): Promise<void> {
    const { title } = body;
    const { boardId } = params;
    await this.boardColumnService.create({
      title,
      boardId: boardId as unknown as ObjectId
    });
  }

  @Get('')
  async getAllBoards(): Promise<GetAllBoardsResponse> {
    const boards = await this.boardService.getAll();
    const serializedBoards = boards.map((board) => serialize(board, BoardDto));

    return serializedBoards;
  }

  @Get(':id')
  async getBoardById(
    @Param() params: GetBoardByIdParams
  ): Promise<GetBoardByTitleResponse> {
    const { id } = params;
    const board = await this.boardService.getById(id as unknown as ObjectId);
    const serializedBoard = serialize(board, BoardDto);

    return serializedBoard;
  }

  @Get(':id/columns')
  async getBoardColumns(
    @Param() params: GetBoardColumnParams
  ): Promise<GetBoardColumnsResponse> {
    const { id } = params;
    const columns = await this.boardColumnService.getByBoardId(
      id as unknown as ObjectId
    );

    const serializedColumns = columns.map((col) => serialize(col, ColumnDto));

    return serializedColumns;
  }

  @Get('columns/:id/tasks')
  async getColumnTasks(
    @Param() params: GetColumnTaskParams
  ): Promise<GetBoardColumnsResponse> {
    const { id } = params;
    const tasks = await this.taskService.getByColumnId(
      id as unknown as ObjectId
    );

    const serializedTasks = tasks.map((task) => serialize(task, TaskDto));

    return serializedTasks;
  }
}
