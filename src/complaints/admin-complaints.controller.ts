import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ComplaintsService } from './complaints.service';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { ComplaintPriority, ComplaintStatus } from './entities/complaint.entity';

@Controller('admin/complaints')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AdminComplaintsController {
  constructor(private readonly service: ComplaintsService) {}

  @Get()
  async list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: ComplaintStatus,
    @Query('priority') priority?: ComplaintPriority,
    @Query('customerId') customerId?: string,
    @Query('storeId') storeId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.adminList({
      page: Number(page ?? 1),
      limit: Number(limit ?? 20),
      status,
      priority,
      customerId,
      storeId: storeId ? Number(storeId) : undefined,
      from,
      to,
    });
  }
    @Get('/statusesss')
    getStatuses() {
        return {
        items: [
            { value: ComplaintStatus.OPEN,        label: 'Open (مفتوحة)' },
            { value: ComplaintStatus.IN_PROGRESS, label: 'In progress (قيد المعالجة)' },
            { value: ComplaintStatus.RESOLVED,    label: 'Resolved (تم الحل)' },
            { value: ComplaintStatus.CLOSED,      label: 'Closed (مغلقة)' },
        ],
        }
    }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.adminGetById(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateComplaintStatusDto) {
    return this.service.adminUpdateStatus(id, dto);
  }


}
