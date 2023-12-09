import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { LoggerFactory } from './modules/logging/logger.factory';
import { LoggingInterceptor } from './modules/logging/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Global interceptor to monitor api activities
  const logger = LoggerFactory.getLogger(
    new Client({
      node: process.env.ELASTICSEARCH_NODE,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      },
      //headers: { 'x-foo': 'bar' },
    }),
    process.env.LOGGER_TYPE,
    process.env.LOGGER_LEVELS.split('|'),
  );
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
