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

  @Column({ name : 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ name : 'updated_at' , type: 'timestamp' })
  Updated_At: Date;

  @Column({ type: 'int', name: 'store_id' })
  storeId: number;

  // @ManyToOne(() => Store, (s) => s.items, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'store_id' })
  // store: Store;
    @ManyToOne(() => Store, (s) => s.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
