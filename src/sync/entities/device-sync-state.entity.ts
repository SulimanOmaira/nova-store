import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from './store.entity';

@Entity('device_sync_state')
@Index(['storeId', 'deviceId'], { unique: true })
export class DeviceSyncStateEntity {

  @PrimaryGeneratedColumn('increment')
  deviceId: string;

  @Column({ type: 'int', name: 'store_id' })
  storeId: number;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'timestamptz' })
  lastSyncAt: Date;
}
