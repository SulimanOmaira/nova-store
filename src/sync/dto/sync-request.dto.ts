// src/sync/dto/sync-request.dto.ts
import {
  OrderSyncDto,
  StoreSyncDto,
  CashboxSyncDto,
  ItemSyncDto,
  StatSyncDto,
  LogSyncDto,
} from './base-sync.dto';

export class SyncRequestDto {
  // معرّف الجهاز في الأوفلاين (تحطه من Flutter)
  deviceId: string;

  // آخر وقت مزامنة حفظه الجهاز (ISO string)
  lastSyncAt?: string | null;

  // تغييرات الجهاز (لو ما في تغييرات حطها [] مو null)
  orders: OrderSyncDto[] = [];
  stores: StoreSyncDto[] = [];
  cashbox: CashboxSyncDto[] = [];
  items: ItemSyncDto[] = [];
  stats: StatSyncDto[] = [];
  logs: LogSyncDto[] = [];
}
