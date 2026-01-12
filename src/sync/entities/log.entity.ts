import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from './store.entity';

@Entity({ name: 'logs' })
@Index(['storeId'])
@Index(['timestamp'])
export class LogEntity {
  // @PrimaryGeneratedColumn('uuid')
  // @PrimaryGeneratedColumn('increment')
  // id: number; // UUID PK :contentReference[oaicite:1]{index=1}

  @PrimaryColumn({ type: 'uuid' })
  id: string; 

  @Column({ name: 'store_id', type: 'int' })
  storeId: number;

  @Column({ type: 'text' })
  action: string;

  // كان TEXT في SQLite → نخليه timestamptz
  @Column({ type: 'timestamptz' })
  timestamp: Date;

  // في SQLite عندك updatedAt نص. هنا نخليه UpdateDateColumn تلقائيًا.
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  Updated_At: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'boolean', default: false })
  dirty: boolean;

  @ManyToOne(() => Store, (s) => s.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
