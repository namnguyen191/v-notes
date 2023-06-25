import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import bcryptjs from 'bcryptjs';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function (next) {
            if (!this.isModified('password')) {
              return next();
            }

            try {
              const salt = await bcryptjs.genSalt(10);
              this.password = await bcryptjs.hash(this.password, salt);
              return next();
            } catch (error) {
              if (error instanceof Error) {
                return next(error);
              }

              return next(new Error('Unexpected Error'));
            }
          });

          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
