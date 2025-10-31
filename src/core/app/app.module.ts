import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Box } from '../boxes/entities';
import { BoxesModule } from '../boxes/boxes.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';

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
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'read', ttl: 60_000, limit: 100 },
        { name: 'write', ttl: 60_000, limit: 30 },
      ],
      storage: new ThrottlerStorageRedisService(process.env.REDIS_URL),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          stores: [new KeyvRedis(process.env.REDIS_URL)],
        };
      },
    }),

    ProductsModule,
    BoxesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
