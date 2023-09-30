import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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

    const createdBoardColumn = new this.boardColumnModel({
      title,
      board
    });
    return createdBoardColumn.save();
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

    const boardToUpdate = await this.boardColumnModel.findById(id);

    if (!boardToUpdate) {
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
}
