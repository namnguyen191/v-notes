import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserCredentialsDto } from './dtos/user-credentials';

export type UserIdentifier = 'email' | 'id';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async create(createUserDto: UserCredentialsDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async find(params: {
    identifier: UserIdentifier;
    value: string;
  }): Promise<User> {
    const { identifier, value } = params;
    let user: User | null;
    if (identifier === 'email') {
      user = await this.userModel.findOne({ email: value }).exec();
    } else {
      user = await this.userModel.findById(value).exec();
    }

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  findWithPassword(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }
}
