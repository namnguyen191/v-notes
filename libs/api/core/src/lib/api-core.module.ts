import { Module } from '@nestjs/common';
import { ApiAuthModule } from '@v-notes/api/auth';
import { ApiUsersModule } from '@v-notes/api/users';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env['DATABASE_USER']}:${process.env['DATABASE_PASSWORD']}@cluster0.kurrwda.mongodb.net/?retryWrites=true&w=majority`
    ),
    ApiUsersModule,
    ApiAuthModule,
  ],
})
export class ApiCoreModule {}
