import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
const options = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true,
  allowedHeaders:
    'Origin, X-Requested-With, Content-Type, Accept,Authorization',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(options);
  await app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Webserver Version 3')
    .setDescription('This is a web server')
    .setVersion('3.0')
    // .addTag('')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
