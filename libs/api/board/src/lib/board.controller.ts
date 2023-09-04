import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { AuthGuard, CurrentUser } from '@v-notes/api/shared';
import {
  BoardDto,
  CreateBoardRequestBody,
  GetBoardByTitleParams,
  GetBoardByTitleResponse,
  GetCurrenUserBoardsResponse,
  UserFromJwt,
} from '@v-notes/shared/api-interfaces';
import { serialize } from '@v-notes/shared/helpers';
import { ApiBoardService } from './api-board.service';

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardController {
  constructor(private readonly boardService: ApiBoardService) {}

  @Post()
  async createBoard(
    @CurrentUser() user: UserFromJwt,
    @Body() body: CreateBoardRequestBody
  ): Promise<void> {
    const { title } = body;
    await this.boardService.create({
      title,
      useremail: user.email,
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

  @Get(':title')
  async getCurrentBoardById(
    @Param() params: GetBoardByTitleParams,
    @CurrentUser() user: UserFromJwt
  ): Promise<GetBoardByTitleResponse> {
    const { title } = params;
    const board = await this.boardService.getByTitle({
      useremail: user.email,
      title,
    });
    const serializedBoard = serialize(board, BoardDto);

    return serializedBoard;
  }
}
