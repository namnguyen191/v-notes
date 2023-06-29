import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserResponse } from '@v-notes/shared/api-interfaces';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signUp(@Body() body: CreateUserDto): Promise<GetUserResponse> {
    const user: unknown = await this.authService.signUp(body);
    return user as GetUserResponse;
  }
}
