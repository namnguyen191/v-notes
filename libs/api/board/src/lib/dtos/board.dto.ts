import { Expose } from 'class-transformer';

export class BoardDto {
  @Expose()
  title!: string;
}
