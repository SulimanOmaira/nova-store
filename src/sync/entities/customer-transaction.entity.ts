// src/customer-transactions/entities/customer-transaction.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Store } from './store.entity';
import { Customer } from 'src/c-customer/entities/c-customer.entity';
import { Invoice } from './invoice.entity';


export enum TransactionType {
  DEBIT = 'debit',      // زيادة الدين (بيع/فاتورة)
  CREDIT = 'credit',    // خصم من الدين (إرجاع/خصم)
  PAYMENT = 'payment',  // سداد نقدي
  ADJUSTMENT = 'adjustment', // تسوية
}

@Entity('customer_transactions')
@Index(['storeId', 'date'])
@Index(['customerId', 'date'])
@Index(['invoiceId'])
@Index(['type'])
@Index(['storeId', 'customerId', 'isDeleted'])
export class CustomerTransaction {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'store_id' })
  storeId: string;

  @Column({ type: 'bigint', name: 'customer_id' })
  customerId: string;

  @Column({ type: 'uuid', name: 'invoice_id', nullable: true })
  invoiceId: string | null;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ 
    type: 'text',
    nullable: true 
  })
  note: string;

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
  @ManyToOne(() => Store, (store) => store.customerTransactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => Customer, (customer) => customer.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  // @ManyToOne(() => Invoice, (invoice) => invoice.customerTransactions, {
  //   onDelete: 'SET NULL',
  // })
  // @JoinColumn({ name: 'invoice_id' })
  // invoice: Invoice;
  @ManyToOne(() => Invoice, (invoice) => invoice.customerTransactions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice | null;

  // Virtual property لحساب الرصيد
  get balanceImpact(): number {
    switch (this.type) {
      case TransactionType.DEBIT:
      case TransactionType.ADJUSTMENT:
        return this.amount; // زيادة الدين
      case TransactionType.CREDIT:
      case TransactionType.PAYMENT:
        return -this.amount; // خصم من الدين
      default:
        return 0;
    }
  }

  get isPayment(): boolean {
    return this.type === TransactionType.PAYMENT;
  }

  get isInvoiceRelated(): boolean {
    return this.type === TransactionType.DEBIT || this.type === TransactionType.CREDIT;
  }

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}