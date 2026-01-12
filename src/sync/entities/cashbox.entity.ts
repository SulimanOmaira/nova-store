
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Check,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Store } from './store.entity';


export type CashboxType = 'revenue' | 'expense';

@Entity({ name: 'cashbox' })
@Index(['storeId'])
@Index(['date'])
@Check(`"type" IN ('revenue','expense')`)
export class Cashbox {
  // @PrimaryGeneratedColumn('uuid')
  // @PrimaryGeneratedColumn('increment')
  // id: number;

   @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'store_id', type: 'int' })
  storeId: number;

  @Column({ type: 'text' })
  type: CashboxType; // revenue / expense

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string; // numeric يرجع كنص لتجنب فقدان الدقة :contentReference[oaicite:2]{index=2}

  @Column({ type: 'text', nullable: true })
  note?: string;

  // في SQLite كان TEXT. في Postgres خليه date (إذا بدون وقت)
  @Column({ type: 'date' })
  date: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  Updated_At: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'boolean', default: false })
  dirty: boolean;

  @ManyToOne(() => Store, (s) => s.cashboxEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
