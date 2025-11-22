import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,
    { logger: ['error', 'warn', 'log'], }
  );

  // Archivos públicos (css, imágenes, JS)
  app.useStaticAssets(join(process.cwd(), 'public'));

  // Configurar directorio de vistas
  app.setBaseViewsDir(join(process.cwd(), 'views'));

  // Establecer Handlebars como motor de vistas
  app.setViewEngine('hbs');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
