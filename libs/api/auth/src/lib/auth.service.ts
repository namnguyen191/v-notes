import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@v-notes/api/users';
import {
  AccessToken,
  AccessTokenResponse,
} from '@v-notes/shared/api-interfaces';
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

    try {
      await this.userService.find({
        identifier: 'email',
        value: email,
      });
      throw new ConflictException('email already exists');
    } catch (error) {
      if (
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.NOT_FOUND
      ) {
        await this.userService.create({ email, password });

        return {
          access_token: (await this.jwtService.signAsync({
            email,
          })) as AccessToken,
        };
      }

      throw error;
    }
  }

  async signIn(args: { email: string; password: string }) {
    const { email, password } = args;
    const existingUser = await this.userService.findWithPassword(email);

    if (!existingUser || !(await compare(password, existingUser.password))) {
      throw new UnauthorizedException('email or password does not match');
    }

    return {
      access_token: (await this.jwtService.signAsync({
        email: existingUser.email,
      })) as AccessToken,
    };
  }
}
