import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { Product } from './product.entity';
import { SupplierTransaction } from './supplier-transaction.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'store_id' })
  storeId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'boolean', default: false })
  dirty: boolean;

  @OneToMany(() => Invoice, (i) => i.supplier)
  invoices: Invoice[];

  
  @OneToMany(() => Product, (p) => p.supplier)
  products: Product[];
  
  @OneToMany(() => SupplierTransaction, (t) => t.supplier)
  transactions: SupplierTransaction[];
}