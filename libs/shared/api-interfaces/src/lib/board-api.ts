import { IsString } from 'class-validator';

export class CreateBoardRequestBody {
  @IsString()
  title!: string;
}

export type GetBoardByIdParams = {
  id: string;
};
