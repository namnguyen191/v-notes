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

export type GetBoardByIdParams = {
  id: string;
};

export type CreateBoardColumnParams = {
  boardId: string;
};

export class BoardDto {
  @Expose()
  title!: string;

  @Expose()
  id!: string;
}

export type GetCurrenUserBoardsResponse = BoardDto[];
export type GetBoardByTitleResponse = BoardDto;
export type CreateBoardResponse = BoardDto;

export class ColumnDto {
  @Expose()
  title!: string;

  @Expose()
  id!: string;

  @Expose()
  createdAt!: string;

  @Expose()
  updatedAt!: string;
}
