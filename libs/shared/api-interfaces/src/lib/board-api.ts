import { Expose, Transform } from 'class-transformer';
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

export type GetBoardColumnParams = {
  id: string;
};

export type GetColumnTaskParams = {
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

  @Expose()
  @Transform((val) => val.obj['user']['_id'])
  userId!: string;
}

export type GetAllBoardsResponse = BoardDto[];
export type GetCurrenUserBoardsResponse = BoardDto[];
export type GetBoardByTitleResponse = BoardDto;
export type CreateBoardResponse = BoardDto;
export type GetBoardColumnsResponse = ColumnDto[];

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

export class TaskDto {
  @Expose()
  title!: string;

  @Expose()
  id!: string;

  @Expose()
  description?: string;

  @Expose()
  @Transform((val) => val.obj['boardColumn']['_id'])
  boardColumn!: string;

  @Expose()
  createdAt!: string;

  @Expose()
  updatedAt!: string;
}
