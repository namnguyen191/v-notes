import { Body, Controller, Post } from '@nestjs/common';

import { SignUpResponse } from '@v-notes/shared/api-interfaces';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@v-notes/api/users';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signUp(@Body() body: CreateUserDto): Promise<SignUpResponse> {
    return await this.authService.signUp(body);
  }
}
