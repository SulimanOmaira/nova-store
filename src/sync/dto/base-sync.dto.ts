// // src/sync/dto/base-sync.dto.ts

// import { IsBoolean, IsISO8601, IsOptional, IsString, IsNumber } from 'class-validator';

// export class OrderSyncDto {
//   @IsString()
//   id: string;

//   @IsOptional()
//   @IsString()
//   customer?: string;

//   @IsOptional()
//   @IsString()
//   status?: string;

//   @IsOptional()
//   @IsNumber()
//   total?: number;

//   @IsOptional()
//   @IsISO8601()
//   date?: string;

//   @IsBoolean()
//   isDeleted: boolean;

//   @IsISO8601()
//   updatedAt: string;
// }


// export class StoreSyncDto {
//   id: string;
//   name: string;
//   address?: string;
//   products?: number;
//   status?: string;
//   logo?: string;
//   isDeleted: boolean;
//   updatedAt: string;
// }

// export class CashboxSyncDto {
//   id: string;
//   type: 'IN' | 'OUT';
//   amount: number;
//   note?: string;
//   date?: string;
//   isDeleted: boolean;
//   updatedAt: string;
// }

// export class ItemSyncDto {
//   id: string;
//   route: string;
//   title: string;
//   icon?: string;
//   isDeleted: boolean;
//   updatedAt: string;
// }

// export class StatSyncDto {
//   id: string;
//   key: string;
//   json?: string;
//   isDeleted: boolean;
//   updatedAt: string;
// }

// export class LogSyncDto {
//   id: string;
//   action: string;
//   timestamp: string; // ISO
//   isDeleted: boolean;
//   updatedAt: string;
// }
