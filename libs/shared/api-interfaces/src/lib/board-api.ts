import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateBoardRequestBody {
  @IsString()
  title!: string;
}

export type GetBoardByIdParams = {
  id: string;
};

export class BoardDto {
  @Expose()
  title!: string;
}

export type GetCurrenUserBoardsResponse = BoardDto[];
