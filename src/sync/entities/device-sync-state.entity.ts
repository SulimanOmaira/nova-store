import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Store } from './store.entity';

@Entity('device_sync_state')
@Index(['storeId', 'deviceId'], { unique: true })
export class DeviceSyncStateEntity {

  @PrimaryColumn({ type: 'varchar', length: 100 })
  deviceId: string;

  @Column({ type: 'uuid', name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'timestamptz' })
  lastSyncAt: Date;
}
