import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'hlib',
      database: 'gator',
      entities: [Product],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'read',
        ttl: 60_000,
        limit: 100,
      },
      {
        name: 'write',
        ttl: 60_000,
        limit: 30,
      },
    ]),

    ProductsModule,
  ],
})
export class AppModule {}
