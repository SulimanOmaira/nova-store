import {
  Entity,
  PrimaryColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Store } from './store.entity';

@Entity('orders')
export class OrderEntity {
  // @PrimaryColumn({ type: 'varchar', length: 50 })
  // id: string; // نفس id اللي في الجهاز
  @PrimaryColumn('uuid')
  id: string; 

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'timestamp', nullable: true })
  date: Date | null;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  // مهم لـ LWW
  @Column({ type: 'timestamp' })
  updatedAt: Date;

  
  @Column({ type: 'uuid', name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, (s) => s.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'bigint', name: 'customer_id', nullable: true })
  customerId: string | null; // لأن Customer عندك bigint
}

