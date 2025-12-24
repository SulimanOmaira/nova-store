import { Module } from '@nestjs/common';
import { SyncApiController } from './sync-api.controller';
import { SyncApiService } from './sync-api.service';

@Module({
  controllers: [SyncApiController],
  providers: [SyncApiService],
  exports: [SyncApiService],
})
export class SyncApiModule {}
