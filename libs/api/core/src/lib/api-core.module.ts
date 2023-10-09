import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiAuthModule } from '@v-notes/api/auth';
import { ApiBoardModule } from '@v-notes/api/board';
import { ApiUsersModule } from '@v-notes/api/users';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env['DATABASE_USER']}:${process.env['DATABASE_PASSWORD']}@cluster0.kurrwda.mongodb.net/?retryWrites=true&w=majority`
    ),
    JwtModule.register({
      global: true,
      secret: process.env['JWT_SECRETS'],
      signOptions: { expiresIn: '1d' }
    }),
    ApiUsersModule,
    ApiAuthModule,
    ApiBoardModule
  ]
})
export class ApiCoreModule {}
