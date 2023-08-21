import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@v-notes/api/users';
import { AccessTokenResponse } from '@v-notes/shared/api-interfaces';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(args: {
    email: string;
    password: string;
  }): Promise<AccessTokenResponse> {
    const { email, password } = args;
    const existingUser = await this.userService.find({
      identifier: 'email',
      value: email,
    });

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

  async signIn(args: { email: string; password: string }) {
    const { email, password } = args;
    const existingUser = await this.userService.findWithPassword(email);

    if (!existingUser || !(await compare(password, existingUser.password))) {
      throw new UnauthorizedException('email or password does not match');
    }

    return {
      access_token: await this.jwtService.signAsync({
        email: existingUser.email,
      }),
    };
  }
}
