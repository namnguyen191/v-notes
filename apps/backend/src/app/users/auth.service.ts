import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(args: { email: string; password: string }) {
    const { email, password } = args;
    const existingUser = await this.userService.find(email);

    if (existingUser) {
      throw new ConflictException('email already exists');
    }

    const user = await this.userService.create({ email, password });

    return {
      ...user,
      access_token: await this.jwtService.signAsync({
        email,
      }),
    };
  }
}
