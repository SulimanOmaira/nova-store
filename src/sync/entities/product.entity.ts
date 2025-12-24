// src/products/entities/product.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Supplier } from './supplier.entity';
import { StockHistory } from './stock-history.entity';
import { InvoiceItem } from './invoice-item.entity';
import { Store } from './store.entity';


@Entity('products')
export class Product {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'store_id' })
  storeId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    default: 0,
  })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    name: 'minquantity',
    default: 0,
  })
  minQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'buyprice',
    default: 0,
  })
  buyPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'sellprice',
    default: 0,
  })
  sellPrice: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 500, name: 'imagepath', nullable: true })
  imagePath: string;

  @Column({ type: 'uuid', name: 'supplier_id', nullable: true })
  supplierId: string | null;

  @Column({ type: 'varchar', length: 50, default: 'unit' })
  unit: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode: string;

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

  @ManyToOne(() => Supplier, (supplier) => supplier.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier | null;

  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(() => StockHistory, (history) => history.product)
  stockHistories: StockHistory[];

  @OneToMany(() => InvoiceItem, (item) => item.product)
  invoiceItems: InvoiceItem[];

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}