import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';

@Controller('complaints')
@UseGuards(JwtAuthGuard)
export class ComplaintsController {
  constructor(private readonly service: ComplaintsService) {}

  // لازم يكون role customer
 @Post()
async create(@Req() req: any, @Body() dto: CreateComplaintDto) {
  const customerId = String(req.user.userId);
  return this.service.createByCustomer(customerId, dto);
}

  @Get()
  async listMine(@Req() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    const customerId = String(req.user.userId);
    return this.service.listMine(customerId, Number(page ?? 1), Number(limit ?? 20));
  }

  @Get(':id')
  async getMine(@Req() req: any, @Param('id') id: string) {
    const customerId = String(req.user.userId);
    return this.service.getMineById(customerId, id);
  }
}
