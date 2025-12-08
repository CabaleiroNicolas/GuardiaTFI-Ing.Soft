import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,
    { logger: ['error', 'warn', 'log'], }
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const allowedOrigin = process.env.CORS_ORIGIN || '*';

  app.enableCors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin) {
        return callback(null, true);
      }
      console.log(`[CORS] Request desde: '${requestOrigin}'`);
      console.log(`[CORS] Esperado:      '${allowedOrigin}'`);

      const cleanRequest = requestOrigin.replace(/\/$/, ''); // Quita barra final si existe
      const cleanAllowed = (allowedOrigin || '').replace(/\/$/, ''); // Quita barra final si existe

      if (cleanRequest === cleanAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS] ⛔ Bloqueado. No coinciden.`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
