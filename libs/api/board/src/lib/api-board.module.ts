import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiUsersModule } from '@v-notes/api/users';
import { ApiBoardColumnService } from './api-board-column.service';
import { ApiBoardService } from './api-board.service';
import { BoardColumn, BoardColumnSchema } from './board-column.schema';
import { BoardSocketGateway } from './board-socket.gateway';
import { BoardController } from './board.controller';
import { Board, BoardSchema } from './board.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Board.name,
        schema: BoardSchema,
      },
      {
        name: BoardColumn.name,
        schema: BoardColumnSchema,
      },
    ]),
    ApiUsersModule,
  ],
  controllers: [BoardController],
  providers: [ApiBoardService, ApiBoardColumnService, BoardSocketGateway],
  exports: [ApiBoardService],
})
export class ApiBoardModule {}
