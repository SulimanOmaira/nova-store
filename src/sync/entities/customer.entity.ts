import { Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CustomerTransaction } from './customer-transaction.entity';
import { Invoice } from './invoice.entity';

@Entity('customers') // اسم الجدول lowercase
@Index(['storeId'])
@Index(['updatedAt'])
export class Customer {
  // @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  // id: string;
  @PrimaryColumn({ type: 'uuid' })
  id: string; 

  @Column({ name: 'store_id', type: 'int' })
  storeId: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'boolean', default: false })
  dirty: boolean;

  
@OneToMany(() => Invoice, (i) => i.customer)
invoices: Invoice[];

@OneToMany(() => CustomerTransaction, (t) => t.customer)
transactions: CustomerTransaction[];
}
