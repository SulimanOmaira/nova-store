// src/sync/entities/stat.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('stats')
export class StatEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'text', nullable: true })
  json: string | null;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
