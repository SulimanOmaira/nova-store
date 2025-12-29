// // src/sync/entities/cashbox.entity.ts
// import { Entity, PrimaryColumn, Column } from 'typeorm';

// @Entity('cashbox')
// export class CashboxEntity {
//   @PrimaryColumn({ type: 'varchar', length: 50 })
//   id: string;

//   @Column({ type: 'varchar', length: 10 })
//   type: 'IN' | 'OUT';

//   @Column({ type: 'decimal', precision: 12, scale: 2 })
//   amount: number;

//   @Column({ type: 'varchar', length: 255, nullable: true })
//   note: string | null;

//   @Column({ type: 'timestamp', nullable: true })
//   date: Date | null;

//   @Column({ type: 'boolean', default: false })
//   isDeleted: boolean;

//   @Column({ type: 'timestamp' })
//   updatedAt: Date;
// }
// /***
//  * 
//  CREATE TABLE cashbox(
//   id TEXT PRIMARY KEY,
//   store_id TEXT,
//   type TEXT,                 -- revenue / expense
//   amount REAL,
//   note TEXT,
//   date TEXT,
//   createdAt TEXT,
//   updatedAt TEXT,
//   isDeleted INTEGER DEFAULT 0,
//   dirty INTEGER DEFAULT 0
// )
//  */


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
  @PrimaryGeneratedColumn('increment')
  id: number;

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
