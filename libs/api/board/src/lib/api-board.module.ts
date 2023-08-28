import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiUsersModule } from '@v-notes/api/users';
import { ApiBoardService } from './api-board.service';
import { BoardController } from './board.controller';
import { Board, BoardSchema } from './board.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Board.name,
        schema: BoardSchema,
      },
    ]),
    ApiUsersModule,
  ],
  controllers: [BoardController],
  providers: [ApiBoardService],
  exports: [ApiBoardService],
})
export class ApiBoardModule {}
