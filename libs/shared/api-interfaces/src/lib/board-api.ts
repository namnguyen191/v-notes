import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateBoardRequestBody {
  @IsString()
  title!: string;
}

export class CreateBoardColumnRequestBody {
  @IsString()
  title!: string;
}

export type GetBoardByTitleParams = {
  title: string;
};

export type CreateBoardColumnParams = {
  boardId: string;
};

export class BoardDto {
  @Expose()
  title!: string;
}

export type GetCurrenUserBoardsResponse = BoardDto[];
export type GetBoardByTitleResponse = BoardDto;
