import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Map Sorter API Documentation v1.0.0')
    .setDescription('The API Documentation for Map Sorter Product of GDSC-DUT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'token',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token',
    );

  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      explore: true,
      deepLinking: true,
      persistAuthorization: true,
    },
  });
}
