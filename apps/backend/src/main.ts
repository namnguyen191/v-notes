/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { exit } from 'process';

const requiredEnvs = new Set<string>([
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'JWT_SECRETS',
]);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    console.log(`Missing env variable ${env}`);
    exit(1);
  }
});

bootstrap();
