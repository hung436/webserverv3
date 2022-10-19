import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.use(cookieParser());
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
