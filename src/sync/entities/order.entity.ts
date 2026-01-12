import {
  Entity,
  PrimaryColumn,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from './store.entity';

@Entity('orders')
export class OrderEntity {
  // @PrimaryColumn({ type: 'varchar', length: 50 })
  // id: string; // نفس id اللي في الجهاز
  // @PrimaryGeneratedColumn('increment')
  // id: number; 
  @PrimaryColumn({ type: 'uuid' })
  id: string; 

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'timestamp', nullable: true })
  date: Date | null;

  @Column({name : 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  // مهم لـ LWW
  @Column({name: 'updated_at', type: 'timestamp' })
  Updated_At: Date;

  
  @Column({ type: 'int', name: 'store_id' })
  storeId: number;

  @ManyToOne(() => Store, (s) => s.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'uuid', name: 'customer_id', nullable: true })
  customerId: string | null; // لأن Customer عندك bigint
}

