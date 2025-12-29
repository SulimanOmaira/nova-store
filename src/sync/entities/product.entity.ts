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
  PrimaryGeneratedColumn,
} from 'typeorm';
 import { Supplier } from './supplier.entity';
import { StockHistory } from './stock-history.entity';
import { InvoiceItem } from './invoice-item.entity';
import { Store } from './store.entity';


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'store_id' })
  storeId: number;

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

  @Column({ type: 'int', name: 'supplier_id', nullable: true })
  supplierId: number | null;

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
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  Updated_At: Date;

  @Column({
    type: 'boolean',
    name: 'is_deleted',
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
 
}