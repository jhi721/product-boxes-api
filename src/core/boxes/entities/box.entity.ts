import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities';

export enum BoxStatus {
  Created = 'CREATED',
  Sealed = 'SEALED',
  Shipped = 'SHIPPED',
}

@Entity()
@Check(`"label" ~ '^[A-Z0-9_-]{3,32}$'`)
export class Box {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 32, unique: true })
  label: string;

  @Column({ type: 'enum', enum: BoxStatus, default: BoxStatus.Created })
  status: BoxStatus;

  @OneToMany(() => Product, (product) => product.box)
  products: Product[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
