import { Body, Controller, Post } from '@nestjs/common';

import { AccessTokenResponse } from '@v-notes/shared/api-interfaces';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from '@v-notes/api/users';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: UserCredentialsDto): Promise<AccessTokenResponse> {
    return await this.authService.signUp(body);
  }

  @Post('signin')
  async signIn(@Body() body: UserCredentialsDto): Promise<AccessTokenResponse> {
    return await this.authService.signIn(body);
  }
}
