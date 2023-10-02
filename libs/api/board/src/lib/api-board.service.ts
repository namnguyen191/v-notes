import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '@v-notes/api/users';
import { Model, ObjectId } from 'mongoose';
import { Board } from './board.schema';

@Injectable()
export class ApiBoardService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
    private readonly userService: UserService
  ) {}

  async create(board: { useremail: string; title: string }): Promise<Board> {
    const { useremail, title } = board;
    const user = await this.userService.find({
      identifier: 'email',
      value: useremail
    });
    const createdBoard = new this.boardModel({
      title,
      user
    });
    return createdBoard.save();
  }

  async getByUser(useremail: string): Promise<Board[]> {
    const user = await this.userService.find({
      identifier: 'email',
      value: useremail
    });
    const userBoards = await this.boardModel.find({
      user
    });
    return userBoards;
  }

  async getAll(): Promise<Board[]> {
    const boards = await this.boardModel.find().populate('user');
    return boards;
  }

  async getByTitle(args: { useremail: string; title: string }): Promise<Board> {
    const { useremail, title } = args;
    const user = await this.userService.find({
      identifier: 'email',
      value: useremail
    });
    const userBoard = await this.boardModel
      .findOne({
        user,
        title
      })
      .exec();

    if (!userBoard) {
      throw new NotFoundException();
    }

    return userBoard;
  }

  async getById(id: ObjectId): Promise<Board> {
    try {
      const board = await this.boardModel.findById(id).populate('user');
      if (!board) {
        throw new NotFoundException();
      }

      return board;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      const board = await this.boardModel.findById(id);

      if (!board) {
        throw new NotFoundException();
      }

      await this.boardModel.findByIdAndDelete(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
