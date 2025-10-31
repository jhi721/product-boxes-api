import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Box } from './entities';
import { Product } from '@core/products/entities';
import { BoxesRepository } from './boxes.repository';
import { BoxesController } from './boxes.controller';
import { BoxesService } from './boxes.service';
import { ProductsRepository } from '@core/products/products.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Box, Product])],
  controllers: [BoxesController],
  providers: [BoxesService, BoxesRepository, ProductsRepository],
})
export class BoxesModule {}
