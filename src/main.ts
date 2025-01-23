import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (typeof global.crypto === 'undefined') {
    global.crypto = require('crypto');
  }

  await app.listen(3001);
}
bootstrap();
