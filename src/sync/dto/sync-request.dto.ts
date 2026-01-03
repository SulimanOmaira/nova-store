// import {
//   IsArray,
//   IsISO8601,
//   IsOptional,
//   IsString,
//   ValidateNested,
// } from 'class-validator';
// import { Type } from 'class-transformer';

// import {
//   OrderSyncDto,
//   StoreSyncDto,
//   CashboxSyncDto,
//   ItemSyncDto,
//   StatSyncDto,
//   LogSyncDto,
// } from './base-sync.dto';

// export class SyncRequestDto {
//   @IsString()
//   deviceId: string;

//   @IsOptional()
//   @IsISO8601()
//   lastSyncAt?: string | null;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => OrderSyncDto)
//   orders: OrderSyncDto[] = [];

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => StoreSyncDto)
//   stores: StoreSyncDto[] = [];

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CashboxSyncDto)
//   cashbox: CashboxSyncDto[] = [];

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => ItemSyncDto)
//   items: ItemSyncDto[] = [];

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => StatSyncDto)
//   stats: StatSyncDto[] = [];

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => LogSyncDto)
//   logs: LogSyncDto[] = [];
// }
