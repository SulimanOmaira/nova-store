// src/sync/entities/device-sync-state.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('device_sync_state')
export class DeviceSyncStateEntity {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  deviceId: string;

  @Column({ type: 'timestamp' })
  lastSyncAt: Date;
}
