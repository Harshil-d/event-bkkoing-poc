import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { buildSwaggerDocument } from './config/swagger.config';

/**
 * Bootstraps the NestJS HTTP server with global middleware, pipes, and prefix configuration.
 * This runner reads configuration values from ConfigService at runtime, but falls back to sane defaults during bootstrap.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const globalPrefix = process.env.APP_GLOBAL_PREFIX ?? 'api';
  app.setGlobalPrefix(globalPrefix);

  const swaggerDocument = buildSwaggerDocument();
  const openApiDocument = SwaggerModule.createDocument(app, swaggerDocument);
  SwaggerModule.setup('docs', app, openApiDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3001;
  await app.listen(port);
}

void bootstrap();
