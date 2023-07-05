import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserCredentialsDto } from './dtos/user-credentials';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async create(createUserDto: UserCredentialsDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  find(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  findWithPassword(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }
}
