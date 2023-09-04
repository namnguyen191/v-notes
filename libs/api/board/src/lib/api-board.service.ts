import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '@v-notes/api/users';
import { Model } from 'mongoose';
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
      value: useremail,
    });
    const createdBoard = new this.boardModel({
      title,
      user,
    });
    return createdBoard.save();
  }

  async getByUser(useremail: string): Promise<Board[]> {
    const user = await this.userService.find({
      identifier: 'email',
      value: useremail,
    });
    const userBoards = this.boardModel.find({
      user,
    });
    return userBoards;
  }

  async getByTitle(args: { useremail: string; title: string }): Promise<Board> {
    const { useremail, title } = args;
    const user = await this.userService.find({
      identifier: 'email',
      value: useremail,
    });
    const userBoard = await this.boardModel
      .findOne({
        user,
        title,
      })
      .exec();

    if (!userBoard) {
      throw new NotFoundException();
    }

    return userBoard;
  }
}
