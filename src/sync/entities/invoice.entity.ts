// src/invoices/entities/invoice.entity.ts
import { Customer } from 'src/c-customer/entities/c-customer.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { InvoiceItem } from './invoice-item.entity';
import { Store } from './store.entity';
import { Supplier } from './supplier.entity';
import { CustomerTransaction } from './customer-transaction.entity';
import { SupplierTransaction } from './supplier-transaction.entity';

export enum InvoiceType {
  SALE = 'sale',
  PURCHASE = 'purchase',
  RETURN = 'return',
}

@Entity('invoices')
@Index(['storeId', 'invoiceNumber'])
@Index(['storeId', 'date'])
@Index(['storeId', 'type', 'isDeleted'])
export class Invoice {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'store_id' })
  storeId: string;

  @Column({ 
    type: 'varchar', 
    length: 50,
    name: 'invoicenumber' 
  })
  invoiceNumber: string;

  @Column({
    type: 'enum',
    enum: InvoiceType,
    default: InvoiceType.SALE,
  })
  type: InvoiceType;

  @Column({ type: 'bigint', name: 'customer_id', nullable: true })
  customerId: string | null;

  @Column({ type: 'uuid', name: 'supplier_id', nullable: true })
  supplierId: string | null;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  subtotal: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  discount: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  tax: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  total: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  paid: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  remaining: number;

  @Column({
    type: 'date',
  })
  date: Date;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdat',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updatedat',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    type: 'boolean',
    name: 'isdeleted',
    default: false,
  })
  isDeleted: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  dirty: boolean;

  // العلاقات
  @ManyToOne(() => Store, (store) => store.invoices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  // @ManyToOne(() => Customer, (customer) => customer.invoices, {
  //   onDelete: 'SET NULL',
  // })
  @ManyToOne(() => Customer, (c) => c.invoices, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer | null;

  // @JoinColumn({ name: 'customer_id' })
  // customer: Customer;

  // @ManyToOne(() => Supplier, (supplier) => supplier.invoices, {
  //   onDelete: 'SET NULL',
  // })
  // @JoinColumn({ name: 'supplier_id' })
  // supplier: Supplier;
  @ManyToOne(() => Supplier, (s) => s.invoices, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier | null;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, {
    cascade: true,
  })
  items: InvoiceItem[];

  @OneToMany(() => CustomerTransaction, (t) => t.invoice)
customerTransactions: CustomerTransaction[];

  // Virtual fields
  get status(): string {
    if (this.remaining === 0) return 'paid';
    if (this.remaining === this.total) return 'unpaid';
    return 'partial';
  }

  @OneToMany(() => SupplierTransaction, (t) => t.invoice)
  supplierTransactions: SupplierTransaction[];

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}