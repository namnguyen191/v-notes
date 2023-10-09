import { Module } from '@nestjs/common';
import { ApiUsersModule } from '@v-notes/api/users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [ApiUsersModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class ApiAuthModule {}
