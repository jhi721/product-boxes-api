import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Product } from '../core/products/entities';
import { Box } from '../core/boxes/entities';

const url = process.env.DB_URL;

const AppDataSource = new DataSource({
  type: 'postgres',
  url,
  entities: [Product, Box],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});

export default AppDataSource;
