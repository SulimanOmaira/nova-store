// src/sync/entities/log.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('logs')
export class LogEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'text' })
  action: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
