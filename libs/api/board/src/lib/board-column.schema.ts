import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Board } from './board.schema';

export type BoardColumnDocument = HydratedDocument<BoardColumn>;

@Schema({ timestamps: true })
export class BoardColumn {
  @Prop({
    type: String,
    required: [true, 'title is required'],
  })
  title!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  board!: Board;
}

export const BoardColumnSchema = SchemaFactory.createForClass(BoardColumn);
