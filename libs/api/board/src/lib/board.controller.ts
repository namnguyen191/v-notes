import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { AuthGuard, CurrentUser } from '@v-notes/api/shared';
import {
  BoardDto,
  CreateBoardColumnParams,
  CreateBoardColumnRequestBody,
  CreateBoardRequestBody,
  GetBoardByIdParams,
  GetBoardByTitleResponse,
  GetCurrenUserBoardsResponse,
  UserFromJwt
} from '@v-notes/shared/api-interfaces';
import { serialize } from '@v-notes/shared/helpers';
import { ObjectId } from 'mongoose';
import { ApiBoardColumnService } from './api-board-column.service';
import { ApiBoardService } from './api-board.service';

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardController {
  constructor(
    private readonly boardService: ApiBoardService,
    private readonly boardColumnService: ApiBoardColumnService
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
  async getCurrentUserBoards(
    @CurrentUser() user: UserFromJwt
  ): Promise<GetCurrenUserBoardsResponse> {
    const boards = await this.boardService.getByUser(user.email);
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
}
