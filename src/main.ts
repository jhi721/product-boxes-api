import { NestFactory } from '@nestjs/core';
import { AppModule } from '@core/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypeOrmExceptionFilter } from '@common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Product Boxes API')
    .setDescription('An API for managing boxes and products')
    .setVersion('0.0.1')
    .addTag('product-boxes')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new TypeOrmExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
