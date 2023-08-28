import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthGuard, CurrentUser } from '@v-notes/api/shared';
import {
  BoardDto,
  CreateBoardRequestBody,
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
  async createPost(
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
}
