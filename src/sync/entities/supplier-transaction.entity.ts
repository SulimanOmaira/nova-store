import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Check,
  PrimaryColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { Supplier } from './supplier.entity';



export type SupplierTransactionType = 'debit' | 'credit' | 'payment';

@Entity({ name: 'supplier_transactions' })
@Index(['storeId'])
@Index(['supplierId'])
@Index(['invoiceId'])
@Index(['date'])
@Check(`"type" IN ('debit','credit','payment')`)
export class SupplierTransaction {
//   @PrimaryGeneratedColumn('uuid')
  // @PrimaryGeneratedColumn('increment')
  // id: number; // :contentReference[oaicite:2]{index=2}

  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'store_id', type: 'int' })
  storeId: number;

  @Column({ name: 'supplier_id', type: 'uuid' })
  supplierId: string |null;

  // nullable كما عندك في SQLite
  @Column({ name: 'invoice_id', type: 'uuid', nullable: true })
  invoiceId?: string | null;

  // قيم مالية => numeric
  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: string; // numeric غالبًا يرجع كنص لتجنّب فقدان الدقة :contentReference[oaicite:3]{index=3}

  @Column({ type: 'text' })
  type: SupplierTransactionType;

  @Column({ type: 'text', nullable: true })
  note?: string;

  // كان TEXT → نخليه timestamptz (أو date إذا بدك بدون وقت)
  @Column({ type: 'timestamptz' })
  date: Date; // :contentReference[oaicite:4]{index=4}

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  Updated_At: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'boolean', default: false })
  dirty: boolean;

  // // علاقات (اختيارية)
  // @ManyToOne(() => Supplier, (s) => s.transactions, { onDelete: 'RESTRICT' })
  // @JoinColumn({ name: 'supplier_id'})
  // supplier?: Supplier | null;
@ManyToOne(() => Supplier, (s) => s.transactions, {
  nullable: true,
  onDelete: 'SET NULL',
})
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier | null;

  // @ManyToOne(() => Invoice, (i) => i.supplierTransactions, { onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'invoice_id' })
  // invoice?: Invoice | null;
  @ManyToOne(() => Invoice, (i) => i.supplierTransactions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice | null;

  
}
