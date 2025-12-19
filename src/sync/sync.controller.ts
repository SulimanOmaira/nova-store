// src/sync/sync.controller.ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SyncService } from './sync.service';
// import { SyncRequestDto } from './dto/sync-request.dto';
// import { SyncResponseDto } from './dto/sync-response.dto';

// استبدل JwtAuthGuard باللي عندك
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SyncRequestDto } from './dto/sync-request.dto';
import { SyncResponseDto } from './dto/sync-response.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @Post()
  async sync(@Body() body: SyncRequestDto): Promise<SyncResponseDto> {
    return this.syncService.sync(body);
  }
}
