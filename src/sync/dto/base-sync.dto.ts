// src/sync/dto/base-sync.dto.ts

export class OrderSyncDto {
  id: string;
  customer?: string;
  status?: string;
  total?: number;
  date?: string; // ISO string
  isDeleted: boolean;
  updatedAt: string; // ISO string
}

export class StoreSyncDto {
  id: string;
  name: string;
  address?: string;
  products?: number;
  status?: string;
  logo?: string;
  isDeleted: boolean;
  updatedAt: string;
}

export class CashboxSyncDto {
  id: string;
  type: 'IN' | 'OUT';
  amount: number;
  note?: string;
  date?: string;
  isDeleted: boolean;
  updatedAt: string;
}

export class UserSyncDto {
  id: string;
  name: string;
  role?: string;
  pin?: string;
  isDeleted: boolean;
  updatedAt: string;
}

export class ItemSyncDto {
  id: string;
  route: string;
  title: string;
  icon?: string;
  isDeleted: boolean;
  updatedAt: string;
}

export class StatSyncDto {
  id: string;
  key: string;
  json?: string;
  isDeleted: boolean;
  updatedAt: string;
}

export class LogSyncDto {
  id: string;
  action: string;
  timestamp: string; // ISO
  isDeleted: boolean;
  updatedAt: string;
}
