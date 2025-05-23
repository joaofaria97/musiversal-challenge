import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateSwagger } from './swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  
  // Enable CORS
  app.enableCors();
  
  // Configure file upload limits
  app.use(json({ limit: '50mb' }));
  
  // Serve static files from the storage directory
  app.useStaticAssets(join(process.cwd(), 'storage'), {
    prefix: '/storage',
  });
  
  // Generate Swagger file
  await generateSwagger();

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3001);

  // Start the server
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
