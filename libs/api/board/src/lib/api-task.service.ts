import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError, ObjectId } from 'mongoose';
import { ApiBoardColumnService } from './api-board-column.service';
import { Task } from './task.schema';

@Injectable()
export class ApiTaskService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
    private readonly boardColumnService: ApiBoardColumnService
  ) {}

  async create(task: { columnId: ObjectId; title: string }): Promise<Task> {
    const { columnId, title } = task;
    const boardColumn = await this.boardColumnService.getById(columnId);
    const createdTask = new this.taskModel({
      title,
      boardColumn
    });

    return createdTask.save();
  }

  async getByColumnId(columnId: ObjectId): Promise<Task[]> {
    try {
      const tasks = await this.taskModel.find({
        boardColumn: columnId
      });

      return tasks;
    } catch (error) {
      if (error instanceof MongooseError.CastError) {
        throw new NotFoundException();
      }

      throw new InternalServerErrorException();
    }
  }

  async getById(id: string): Promise<Task> {
    try {
      const task = await this.taskModel.findById(id);

      if (!task) {
        throw new NotFoundException();
      }

      return task;
    } catch (error) {
      if (error instanceof MongooseError.CastError) {
        throw new NotFoundException();
      }

      throw new InternalServerErrorException();
    }
  }

  async updateById(id: string, fieldsToUpdate: Partial<Task>): Promise<Task> {
    try {
      const updatedTask = await this.taskModel.findByIdAndUpdate(
        id,
        { ...fieldsToUpdate },
        { new: true }
      );

      if (!updatedTask) {
        throw new NotFoundException();
      }

      return updatedTask;
    } catch (error) {
      if (error instanceof MongooseError.CastError) {
        throw new NotFoundException();
      }

      throw new InternalServerErrorException();
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.taskModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof MongooseError.CastError) {
        throw new NotFoundException();
      }

      throw new InternalServerErrorException();
    }
  }
}
