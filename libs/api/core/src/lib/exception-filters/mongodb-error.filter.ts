import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import * as mongoose from 'mongoose';

@Catch(mongoose.mongo.MongoServerError)
export class MongoDBExceptionFilter implements ExceptionFilter {
  catch(exception: mongoose.mongo.MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === 11000) {
      response.status(HttpStatus.CONFLICT).json({
        error: 'already exists',
      });
    }
  }
}
