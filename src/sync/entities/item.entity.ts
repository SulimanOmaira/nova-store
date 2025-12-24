import { Entity, PrimaryColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Store } from './store.entity';

@Entity('items')
export class ItemEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  route: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  icon: string | null;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'uuid', name: 'store_id' })
  storeId: string;

  // @ManyToOne(() => Store, (s) => s.items, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'store_id' })
  // store: Store;
    @ManyToOne(() => Store, (s) => s.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
