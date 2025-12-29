// src/stock-history/entities/stock-history.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
 import { Product } from './product.entity';
import { Store } from './store.entity';

@Entity('stock_history')
@Index(['storeId', 'createdAt'])
@Index(['productId', 'createdAt'])
export class StockHistory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'store_id' })
  storeId: number;

  @Column({ type: 'int', name: 'product_id' })
  productId: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    name: 'oldqty',
  })
  oldQty: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    name: 'newqty',
  })
  newQty: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
  })
  change: number;

  @Column({ 
    type: 'varchar', 
    length: 100,
    nullable: true 
  })
  reason: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdat',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'boolean',
    name: 'is_deleted',
    default: false,
  })
  isDeleted: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  dirty: boolean;

  // العلاقات
  @ManyToOne(() => Product, (product) => product.stockHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Store, (store) => store.stockHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;
  
}