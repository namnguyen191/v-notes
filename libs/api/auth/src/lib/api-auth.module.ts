import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ApiUsersModule } from '@v-notes/api/users';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env['JWT_SECRETS'],
      signOptions: { expiresIn: '1d' },
    }),
    ApiUsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class ApiAuthModule {}
