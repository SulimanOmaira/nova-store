import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { Product } from './product.entity';


@Entity({ name: 'invoice_items' })
@Index(['invoiceId'])
@Index(['productId'])
export class InvoiceItem {
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn('uuid')
  id: string;

  // FK: invoice_id
  @Column({ name: 'invoice_id', type: 'uuid' })
  invoiceId: string;

  // FK: product_id
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'product_name', type: 'text' })
  productName: string;

  // الكميات قد تكون كسور، استخدم numeric
  @Column({ type: 'numeric', precision: 12, scale: 3 })
  quantity: string; // TypeORM يرجّع numeric كنص لتجنب فقدان الدقة

  // الأسعار / الإجمالي: numeric
  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  total: string;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'boolean', default: false })
  dirty: boolean;

  // علاقات (اختيارية)
  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice?: Invoice;

  @ManyToOne(() => Product, (product) => product.invoiceItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product?: Product;
}
