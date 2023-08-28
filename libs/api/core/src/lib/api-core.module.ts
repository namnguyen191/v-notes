import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiAuthModule } from '@v-notes/api/auth';
import { ApiUsersModule } from '@v-notes/api/users';
import { ApiBoardModule } from 'api/board';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env['DATABASE_USER']}:${process.env['DATABASE_PASSWORD']}@cluster0.kurrwda.mongodb.net/?retryWrites=true&w=majority`
    ),
    ApiUsersModule,
    ApiAuthModule,
    ApiBoardModule,
  ],
})
export class ApiCoreModule {}
