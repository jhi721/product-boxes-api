import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities';
import { ThrottlerModule } from '@nestjs/throttler';
import { Box } from '../boxes/entities';
import { BoxesModule } from '../boxes/boxes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      ssl: process.env.DB_SSL === 'true',
      synchronize: process.env.NODE_ENV !== 'production',
      entities: [Product, Box],
    }),
    ThrottlerModule.forRoot(),

    ProductsModule,
    BoxesModule,
  ],
})
export class AppModule {}
