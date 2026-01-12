import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from './store.entity';

@Entity({ name: 'stats' })
@Index(['storeId'])
@Index(['key'])
export class StatEntity {
  // @PrimaryGeneratedColumn('uuid')
  // @PrimaryGeneratedColumn('increment')
  // id: string; // UUID PK :contentReference[oaicite:2]{index=2}

  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'store_id', type: 'int' })
  storeId: number;

  // "key" اسم عمود عادي في PostgreSQL، لكن إن أحببت نغيره لـ stat_key لتجنب أي لبس
  @Column({ name: 'key', type: 'text' })
  key: string;

  // كان TEXT في SQLite → نخليه jsonb
  @Column({ type: 'text' })
  json: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  Updated_At: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'boolean', default: false })
  dirty: boolean;

  @ManyToOne(() => Store, (s) => s.stats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;
}

