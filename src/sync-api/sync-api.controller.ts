import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SyncApiService } from './sync-api.service';
import { SyncPullQueryDto, SyncPushBodyDto, SyncPushResult } from './sync-api.dto';

@Controller('sync')
export class SyncApiController {
  constructor(private readonly syncService: SyncApiService) {}

  @Get('pull')
  async pull(@Query() q: SyncPullQueryDto) {
    const limit = q.limit ? Math.max(50, Math.min(5000, Number(q.limit))) : 1000;
    return this.syncService.pull({
      storeId: q.storeId,
      deviceId: q.deviceId,
      since: q.since ? new Date(q.since) : null,
      limit,
    });
  }

  @Post('push')
  async push(@Body() body: SyncPushBodyDto): Promise<SyncPushResult> {
    return this.syncService.push(body);
  }
}
