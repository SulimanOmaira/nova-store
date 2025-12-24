import { IsISO8601, IsObject, IsOptional, IsString } from 'class-validator';

export class SyncPullQueryDto {
  @IsString()
  storeId: string;

  @IsString()
  deviceId: string;

  // آخر وقت مزامنة معروف عند الجهاز (ISO)
  @IsOptional()
  @IsISO8601()
  since?: string;

  // حجم الصفحة (اختياري)
  @IsOptional()
  @IsString()
  limit?: string;
}

export class SyncPushBodyDto {
  @IsString()
  storeId: string;

  @IsString()
  deviceId: string;

  /**
   * changes = map(tableKey -> array of rows)
   * tableKey يجب يطابق keys الموجودة في sync-table.config.ts
   */
  @IsObject()
  changes: Record<string, any[]>;
}

export type SyncAckItem = { id: string; reason?: string };

export type SyncPushResult = {
  accepted: Record<string, string[]>;
  rejected: Record<string, SyncAckItem[]>;
  serverTime: string;
};
