import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

export const buildSwaggerDocument = (): OpenAPIObject =>
  new DocumentBuilder()
    .setTitle('Event Booking API')
    .setDescription('API documentation for the Event Booking backend service.')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Include the JWT access token obtained from the auth endpoints.',
    })
    .build();
