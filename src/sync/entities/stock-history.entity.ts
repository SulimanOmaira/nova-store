// src/stock-history/entities/stock-history.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Product } from './product.entity';
import { Store } from './store.entity';

@Entity('stock_history')
@Index(['storeId', 'createdAt'])
@Index(['productId', 'createdAt'])
export class StockHistory {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'store_id' })
  storeId: string;

  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

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
    name: 'isdeleted',
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

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}