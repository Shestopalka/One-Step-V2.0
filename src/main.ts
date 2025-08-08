import { NestFactory } from '@nestjs/core';
import { TelegramModule } from './telegram/telegram.module';

async function bootstrap() {
  const app = await NestFactory.create(TelegramModule);
  await app.init();
  console.log('App started!');
}
bootstrap();
