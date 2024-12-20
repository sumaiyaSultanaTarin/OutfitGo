import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

const uploadDir = path.join(__dirname, '..', 'uploads'); 
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);  // Create 'uploads' folder if it doesn't exist
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
 