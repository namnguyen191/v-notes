import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import validator from 'validator';
import { compare } from 'bcryptjs';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: [true, 'email is required'],
    validate: [validator.isEmail, 'invalid email'],
    unique: [true, 'email already exist'],
    index: { unique: true },
  })
  email!: string;

  @Prop({
    type: String,
    required: [true, 'password is required'],
    select: false,
  })
  password!: string;

  validatePassword(password: string): Promise<boolean> {
    return compare(this.password, password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);