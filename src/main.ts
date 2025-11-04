import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('api/v1', {
    exclude: ['Health'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
    
   const config = new DocumentBuilder()
    .setTitle('DB Royal API V1')
    .setDescription('DB Royal API v1 for photography service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'openapi.json',
  });

  app.use(
    '/docs',
    apiReference({
      theme: 'default',
      url: '/openapi.json',
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
