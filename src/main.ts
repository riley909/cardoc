import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const option = new DocumentBuilder()
    .setTitle('Cardoc Assignment')
    .setDescription('원티드x위코드 백엔드 프리온보딩 과제 7 : 카닥')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, option);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
