import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

export async function generateSwaggerDocument(app: any) {
  const config = new DocumentBuilder()
    .setTitle('Music Collection API')
    .setDescription('The Music Collection API description')
    .setVersion('1.0')
    .build();

  return SwaggerModule.createDocument(app, config);
}

export async function generateSwagger() {
  const app = await NestFactory.create(AppModule);
  const document = await generateSwaggerDocument(app);
  
  // Go up three levels from apps/api/src to reach the root, then into packages/api-client
  const outputPath = path.resolve(__dirname, '../../../packages/api-client/swagger.json');
  
  // Ensure the directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`Swagger file generated at ${outputPath}`);
  await app.close();
}

// Only run if this file is executed directly
if (require.main === module) {
  generateSwagger();
} 