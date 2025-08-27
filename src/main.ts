import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger } from '@nestjs/common';

async function bootstrap() {

  const looger = new Logger('Main-Gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');


  await app.listen(envs.port);

  looger.log(`Gateway is running on port: ${envs.port}`);
}
bootstrap();
