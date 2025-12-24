// src/sync/sync.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { SyncService } from './sync.service';
// import { SyncController } from './sync.controller';

// import { OrderEntity } from './entities/order.entity';
// import { StoreEntity } from './entities/store.entity';
// import { CashboxEntity } from './entities/cashbox.entity';
// import { UserEntity } from './entities/item.entity';
// import { ItemEntity } from './entities/item.entity';
// import { StatEntity } from './entities/stat.entity';
// import { LogEntity } from './entities/log.entity';
import { DeviceSyncStateEntity } from './entities/device-sync-state.entity';
import { OrderEntity } from './entities/order.entity';
// import { StoreEntity } from './entities/store.entity';
// import { CashboxEntity } from './entities/cashbox.entity';
import { ItemEntity } from './entities/item.entity';
import { StatEntity } from './entities/stat.entity';
import { LogEntity } from './entities/log.entity';
import { Store } from './entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      Store,
      // CashboxEntity,
      ItemEntity,
      StatEntity,
      LogEntity,
      DeviceSyncStateEntity,
    ]),
  ],
  // controllers: [SyncController],
  // providers: [SyncService],
  // exports: [SyncService],
})
export class SyncModule {}
