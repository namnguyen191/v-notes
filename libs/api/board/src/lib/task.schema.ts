import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { BoardColumn } from './board-column.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({
    type: String,
    required: [true, 'title is required']
  })
  title!: string;

  @Prop({
    type: String
  })
  description?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: BoardColumn.name })
  boardColumn!: BoardColumn;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
