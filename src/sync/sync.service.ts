// src/sync/sync.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';

import { OrderEntity } from './entities/order.entity';
import { StoreEntity } from './entities/store.entity';
import { CashboxEntity } from './entities/cashbox.entity';
import { ItemEntity } from './entities/item.entity';
import { StatEntity } from './entities/stat.entity';
import { LogEntity } from './entities/log.entity';
import { DeviceSyncStateEntity } from './entities/device-sync-state.entity';

import { SyncRequestDto } from './dto/sync-request.dto';
import { SyncResponseDto } from './dto/sync-response.dto';
import {
  OrderSyncDto,
  StoreSyncDto,
  CashboxSyncDto,
  UserSyncDto,
  ItemSyncDto,
  StatSyncDto,
  LogSyncDto,
} from './dto/base-sync.dto';

type SyncableEntity = {
  id: string;
  updatedAt: Date;
  isDeleted: boolean;
};

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(StoreEntity)
    private readonly storeRepo: Repository<StoreEntity>,
    @InjectRepository(CashboxEntity)
    private readonly cashboxRepo: Repository<CashboxEntity>,
    @InjectRepository(ItemEntity)
    private readonly itemRepo: Repository<ItemEntity>,
    @InjectRepository(StatEntity)
    private readonly statRepo: Repository<StatEntity>,
    @InjectRepository(LogEntity)
    private readonly logRepo: Repository<LogEntity>,
    @InjectRepository(DeviceSyncStateEntity)
    private readonly deviceSyncRepo: Repository<DeviceSyncStateEntity>,
  ) {}

  async sync(request: SyncRequestDto): Promise<SyncResponseDto> {
    const serverNow = new Date();

    const lastSyncAt =
      request.lastSyncAt != null ? new Date(request.lastSyncAt) : new Date(0);

    await this.applyPush(request);

    const response = await this.buildPullResponse(lastSyncAt);

    await this.deviceSyncRepo.upsert(
      {
        deviceId: request.deviceId,
        lastSyncAt: serverNow,
      },
      ['deviceId'],
    );

    return {
      ...response,
      now: serverNow.toISOString(),
    };
  }

  // ---------- PUSH ----------

  private async applyPush(request: SyncRequestDto): Promise<void> {
    await Promise.all([
      this.applyCollection<OrderEntity, OrderSyncDto>(
        this.orderRepo,
        request.orders || [],
        this.mapOrderDtoToEntity.bind(this),
      ),
      this.applyCollection<StoreEntity, StoreSyncDto>(
        this.storeRepo,
        request.stores || [],
        this.mapStoreDtoToEntity.bind(this),
      ),
      this.applyCollection<CashboxEntity, CashboxSyncDto>(
        this.cashboxRepo,
        request.cashbox || [],
        this.mapCashboxDtoToEntity.bind(this),
      ),
      this.applyCollection<ItemEntity, ItemSyncDto>(
        this.itemRepo,
        request.items || [],
        this.mapItemDtoToEntity.bind(this),
      ),
      this.applyCollection<StatEntity, StatSyncDto>(
        this.statRepo,
        request.stats || [],
        this.mapStatDtoToEntity.bind(this),
      ),
      this.applyCollection<LogEntity, LogSyncDto>(
        this.logRepo,
        request.logs || [],
        this.mapLogDtoToEntity.bind(this),
      ),
    ]);
  }

  private async applyCollection<
    T extends SyncableEntity,
    D extends { id: string; updatedAt: string }
  >(
    repo: Repository<T>,
    dtos: D[],
    mapper: (dto: D) => Partial<T>,
  ): Promise<void> {
    for (const dto of dtos) {
      await this.applyOne(repo, dto, mapper);
    }
  }

  private async applyOne<
    T extends SyncableEntity,
    D extends { id: string; updatedAt: string }
  >(
    repo: Repository<T>,
    dto: D,
    mapper: (dto: D) => Partial<T>,
  ): Promise<void> {
    const existing = await repo.findOne({
      where: { id: dto.id } as any,
    });

    const incomingUpdatedAt = new Date(dto.updatedAt);

    if (!existing) {
      const entity = repo.create({
        id: dto.id,
        updatedAt: incomingUpdatedAt,
        ...(mapper(dto) as any),
      });
      await repo.save(entity);
      return;
    }

    if (existing.updatedAt && existing.updatedAt >= incomingUpdatedAt) {
      return;
    }

    const merged = repo.merge(existing, {
      updatedAt: incomingUpdatedAt,
      ...(mapper(dto) as any),
    });

    await repo.save(merged);
  }

  // ---------- PULL ----------

  private async buildPullResponse(
    lastSyncAt: Date,
  ): Promise<Omit<SyncResponseDto, 'now'>> {
    const orders = await this.orderRepo.find({
      where: { updatedAt: MoreThan(lastSyncAt) },
    });
    const stores = await this.storeRepo.find({
      where: { updatedAt: MoreThan(lastSyncAt) },
    });
    const cashbox = await this.cashboxRepo.find({
      where: { updatedAt: MoreThan(lastSyncAt) },
    });
    const items = await this.itemRepo.find({
      where: { updatedAt: MoreThan(lastSyncAt) },
    });
    const stats = await this.statRepo.find({
      where: { updatedAt: MoreThan(lastSyncAt) },
    });
    const logs = await this.logRepo.find({
      where: { updatedAt: MoreThan(lastSyncAt) },
    });

    return {
      orders: orders.map(this.mapOrderEntityToDto),
      stores: stores.map(this.mapStoreEntityToDto),
      cashbox: cashbox.map(this.mapCashboxEntityToDto),
      items: items.map(this.mapItemEntityToDto),
      stats: stats.map(this.mapStatEntityToDto),
      logs: logs.map(this.mapLogEntityToDto),
    };
  }

  // ---------- DTO -> Entity ----------

  private mapOrderDtoToEntity(dto: OrderSyncDto): Partial<OrderEntity> {
    return {
      customer: dto.customer ?? null,
      status: dto.status ?? null,
      total: dto.total ?? 0,
      isDeleted: dto.isDeleted,
      date: dto.date ? new Date(dto.date) : null,
    };
  }

  private mapStoreDtoToEntity(dto: StoreSyncDto): Partial<StoreEntity> {
    return {
      name: dto.name,
      address: dto.address ?? null,
      products: dto.products ?? 0,
      status: dto.status ?? null,
      logo: dto.logo ?? null,
      isDeleted: dto.isDeleted,
    };
  }

  private mapCashboxDtoToEntity(dto: CashboxSyncDto): Partial<CashboxEntity> {
    return {
      type: dto.type,
      amount: dto.amount,
      note: dto.note ?? null,
      date: dto.date ? new Date(dto.date) : null,
      isDeleted: dto.isDeleted,
    };
  }

  // private mapUserDtoToEntity(dto: UserSyncDto): Partial<UserEntity> {
  //   return {
  //     name: dto.name,
  //     role: dto.role ?? null,
  //     pin: dto.pin ?? null,
  //     isDeleted: dto.isDeleted,
  //   };
  // }

  private mapItemDtoToEntity(dto: ItemSyncDto): Partial<ItemEntity> {
    return {
      route: dto.route,
      title: dto.title,
      icon: dto.icon ?? null,
      isDeleted: dto.isDeleted,
    };
  }

  private mapStatDtoToEntity(dto: StatSyncDto): Partial<StatEntity> {
    return {
      key: dto.key,
      json: dto.json ?? null,
      isDeleted: dto.isDeleted,
    };
  }

  private mapLogDtoToEntity(dto: LogSyncDto): Partial<LogEntity> {
    return {
      action: dto.action,
      timestamp: new Date(dto.timestamp),
      isDeleted: dto.isDeleted,
    };
  }

  // ---------- Entity -> DTO ----------

  private mapOrderEntityToDto(entity: OrderEntity): OrderSyncDto {
    return {
      id: entity.id,
      customer: entity.customer ?? undefined,
      total: Number(entity.total ?? 0),
      status: entity.status ?? undefined,
      date: entity.date?.toISOString(),
      isDeleted: entity.isDeleted,
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  private mapStoreEntityToDto(entity: StoreEntity): StoreSyncDto {
    return {
      id: entity.id,
      name: entity.name,
      address: entity.address ?? undefined,
      products: entity.products ?? 0,
      status: entity.status ?? undefined,
      logo: entity.logo ?? undefined,
      isDeleted: entity.isDeleted,
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  private mapCashboxEntityToDto(entity: CashboxEntity): CashboxSyncDto {
    return {
      id: entity.id,
      type: entity.type,
      amount: Number(entity.amount ?? 0),
      note: entity.note ?? undefined,
      date: entity.date?.toISOString(),
      isDeleted: entity.isDeleted,
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  // private mapUserEntityToDto(entity: UserEntity): UserSyncDto {
  //   return {
  //     id: entity.id,
  //     name: entity.name,
  //     role: entity.role ?? undefined,
  //     pin: entity.pin ?? undefined,
  //     isDeleted: entity.isDeleted,
  //     updatedAt: entity.updatedAt.toISOString(),
  //   };
  // }

  private mapItemEntityToDto(entity: ItemEntity): ItemSyncDto {
    return {
      id: entity.id,
      route: entity.route,
      title: entity.title,
      icon: entity.icon ?? undefined,
      isDeleted: entity.isDeleted,
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  private mapStatEntityToDto(entity: StatEntity): StatSyncDto {
    return {
      id: entity.id,
      key: entity.key,
      json: entity.json ?? undefined,
      isDeleted: entity.isDeleted,
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  private mapLogEntityToDto(entity: LogEntity): LogSyncDto {
    return {
      id: entity.id,
      action: entity.action,
      timestamp: entity.timestamp.toISOString(),
      isDeleted: entity.isDeleted,
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
