// src/sync/entities/cashbox.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('cashbox')
export class CashboxEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 10 })
  type: 'IN' | 'OUT';

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note: string | null;

  @Column({ type: 'timestamp', nullable: true })
  date: Date | null;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
