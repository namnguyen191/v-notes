import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Serialize } from './interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { GetUserResponse } from '@v-notes/shared/api-interfaces';

@Controller('users')
@Serialize(UserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<GetUserResponse> {
    const user: unknown = await this.userService.create(body);
    return user as GetUserResponse;
  }
}
