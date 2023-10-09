/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { MongoDBExceptionFilter } from '@v-notes/api/core';
import * as dotenv from 'dotenv';
import { exit } from 'process';
import { AppModule } from './app/app.module';

const requiredEnvs = new Set<string>([
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'JWT_SECRETS'
]);

async function bootstrap() {
  dotenv.config();
  requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
      console.log(`Missing env: ${JSON.stringify(process.env)}`);
      console.log(`Missing env variable ${env}`);
      exit(1);
    }
  });
  console.log(
    'Nam data is: what is uri',
    `mongodb+srv://${process.env['DATABASE_USER']}:${process.env['DATABASE_PASSWORD']}@cluster0.kurrwda.mongodb.net/?retryWrites=true&w=majority`
  );
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.useGlobalFilters(new MongoDBExceptionFilter());

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
