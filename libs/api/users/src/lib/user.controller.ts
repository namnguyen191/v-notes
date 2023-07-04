import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { GetUserResponse } from '@v-notes/shared/api-interfaces';
import { serialize } from '@v-notes/shared/helpers';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<GetUserResponse> {
    const user = await this.userService.create(body);
    return serialize(user, UserDto);
  }
}
