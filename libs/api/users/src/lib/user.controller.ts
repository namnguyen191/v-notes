import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserCredentialsDto } from './dtos/user-credentials';
import { UserDto } from './dtos/user.dto';
import {
  GetUserParams,
  GetUserResponse,
  UserFromJwt,
} from '@v-notes/shared/api-interfaces';
import { serialize } from '@v-notes/shared/helpers';
import { AuthGuard, CurrentUser } from '@v-notes/api/shared';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: UserCredentialsDto): Promise<GetUserResponse> {
    const user = await this.userService.create(body);
    return serialize(user, UserDto);
  }

  @Get('whoami')
  getCurrentUser(@CurrentUser() user: UserFromJwt | null) {
    return user;
  }

  @Get(':identifier/:value')
  async getUser(@Param() params: GetUserParams): Promise<GetUserResponse> {
    const { identifier, value } = params;

    if (identifier !== 'email' && identifier !== 'id') {
      throw new BadRequestException();
    }

    const user = await this.userService.find({ identifier, value });

    return serialize(user, UserDto);
  }
}
