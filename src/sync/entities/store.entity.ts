// src/sync/entities/store.entity.ts
import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CustomerTransaction } from './customer-transaction.entity';
import { Invoice } from './invoice.entity';
import { Product } from './product.entity';
import { Customer } from 'src/c-customer/entities/c-customer.entity';
import { StockHistory } from './stock-history.entity';
import { Cashbox } from './cashbox.entity';
import { LogEntity } from './log.entity';
import { StatEntity } from './stat.entity';
import { ItemEntity } from './item.entity';
import { OrderEntity } from './order.entity';
import { DeviceSyncStateEntity } from './device-sync-state.entity';

@Entity('stores')
export class Store {
  // @PrimaryColumn({ type: 'varchar', length: 50 })
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  // @Column({ type: 'int', default: 0 })
  // products: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo: string | null;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
  
  @OneToMany(() => CustomerTransaction, (t) => t.store)
  customerTransactions: CustomerTransaction[];  

    @OneToMany(() => Invoice, (i) => i.store)
  invoices: Invoice[];

    @OneToMany(() => Product, (p) => p.store)
  products: Product[];
  
  @OneToMany(() => Customer, (c) => c.store)
  customers: Customer[];

  @OneToMany(() => StockHistory, (h) => h.store)
  stockHistories: StockHistory[];

  @OneToMany(() => StatEntity, (x) => x.store) stats: StatEntity[];
  @OneToMany(() => LogEntity, (x) => x.store) logs: LogEntity[];
  @OneToMany(() => Cashbox, (x) => x.store) cashboxEntries: Cashbox[];

  @OneToMany(() => ItemEntity, (item) => item.store)
  items: ItemEntity[];

  @OneToMany(() => OrderEntity, (order) => order.store)
  orders: OrderEntity[];

  @OneToMany(() => DeviceSyncStateEntity, (d) => d.store)
  deviceSyncStates: DeviceSyncStateEntity[];  
}