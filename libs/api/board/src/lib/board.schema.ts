import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@v-notes/api/users';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type BoardDocument = HydratedDocument<Board>;

@Schema({ timestamps: true })
export class Board {
  @Prop({
    type: String,
    required: [true, 'title is required'],
  })
  title!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user!: User;
}

export const BoardSchema = SchemaFactory.createForClass(Board).index(
  {
    title: 1,
    user: 1,
  },
  { unique: true }
);
