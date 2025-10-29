import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Box } from './entities';
import { Product } from '../products/entities';
import { BoxesRepository } from './boxes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Box, Product])],
  providers: [BoxesRepository],
})
export class BoxesModule {}
