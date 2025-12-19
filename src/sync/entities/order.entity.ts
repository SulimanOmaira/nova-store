// src/sync/entities/order.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
} from 'typeorm';

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string; // نفس id اللي في الجهاز

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
}
