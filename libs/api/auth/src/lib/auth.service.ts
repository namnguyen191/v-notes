import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@v-notes/api/users';
import { SignUpResponse } from '@v-notes/shared/api-interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(args: {
    email: string;
    password: string;
  }): Promise<SignUpResponse> {
    const { email, password } = args;
    const existingUser = await this.userService.find(email);

    if (existingUser) {
      throw new ConflictException('email already exists');
    }

    await this.userService.create({ email, password });

    return {
      access_token: await this.jwtService.signAsync({
        email,
      }),
    };
  }
}
