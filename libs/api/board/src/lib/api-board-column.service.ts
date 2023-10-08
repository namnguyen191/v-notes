import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, mongo } from 'mongoose';
import { ApiBoardService } from './api-board.service';
import { BoardColumn } from './board-column.schema';

@Injectable()
export class ApiBoardColumnService {
  constructor(
    @InjectModel(BoardColumn.name)
    private readonly boardColumnModel: Model<BoardColumn>,
    private readonly boardService: ApiBoardService
  ) {}

  async create(boardColumn: {
    boardId: ObjectId;
    title: string;
  }): Promise<BoardColumn> {
    const { boardId, title } = boardColumn;
    const board = await this.boardService.getById(boardId);

    try {
      const createdBoardColumn = new this.boardColumnModel({
        title,
        board
      });
      const newBoardColumn = await createdBoardColumn.save();
      return newBoardColumn;
    } catch (error) {
      if (error instanceof mongo.MongoServerError) {
        if (error.code === 'E11000') {
          throw new ConflictException();
        } else {
          Logger.error('An unknown mongodb error has occured: ', error);
          throw new InternalServerErrorException();
        }
      } else {
        Logger.error('An unknown error has occured: ', error);
        throw new InternalServerErrorException();
      }
    }
  }

  async getByBoardId(boardId: ObjectId): Promise<BoardColumn[]> {
    const board = await this.boardService.getById(boardId);

    const columnsForBoard = this.boardColumnModel.find({
      board
    });

    return columnsForBoard;
  }

  async getById(id: ObjectId): Promise<BoardColumn> {
    const column = await this.boardColumnModel.findById(id);
    this.boardColumnModel.updateOne();

    if (!column) {
      throw new NotFoundException();
    }

    return column;
  }

  async updateById(args: {
    id: string;
    fieldsToUpdate: Partial<BoardColumn>;
  }): Promise<BoardColumn> {
    const { id, fieldsToUpdate } = args;

    const columnToUpdate = await this.boardColumnModel.findById(id);

    if (!columnToUpdate) {
      throw new NotFoundException();
    }

    return (await this.boardColumnModel.findByIdAndUpdate(
      id,
      { ...fieldsToUpdate },
      {
        new: true
      }
    )) as BoardColumn;
  }

  async deleteById(id: string): Promise<void> {
    const columnToDelete = await this.boardColumnModel.findById(id);

    if (!columnToDelete) {
      throw new NotFoundException();
    }

    await this.boardColumnModel.findByIdAndDelete(id);
  }
}
