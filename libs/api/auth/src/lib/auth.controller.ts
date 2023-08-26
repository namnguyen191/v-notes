import { Body, Controller, Post } from '@nestjs/common';

import { UserCredentialsDto } from '@v-notes/api/users';
import { SignInResponse, SignUpResponse } from '@v-notes/shared/api-interfaces';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: UserCredentialsDto): Promise<SignUpResponse> {
    return await this.authService.signUp(body);
  }

  @Post('signin')
  async signIn(@Body() body: UserCredentialsDto): Promise<SignInResponse> {
    return await this.authService.signIn(body);
  }
}
