import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CCustomerService } from './c-customer.service';
import { UpdateCCustomerDto } from './dto/update-c-customer.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('customer')
export class CCustomerController {
  constructor(private readonly cCustomerService: CCustomerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('all')
  findAll() {
    return this.cCustomerService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @Get('one')
  findOne(@Req() req) {
    const userId = req.user.userId;
    return this.cCustomerService.findOne(userId);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('one/:id')
  fineOneFromAdmin(@Param('id') userId: string) {
    return this.cCustomerService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @Patch('profile')
  update(@Req() req, @Body() dto: UpdateCCustomerDto) {
      const userId = req.user.userId;
    return this.cCustomerService.update(userId, dto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('edit-customer/:id')
  updateCustomer(@Param('id') id: string, @Body() dto: UpdateCCustomerDto) {
    return this.cCustomerService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('delete/:id')
  deleteCustomer(@Param('id') id: string) {
    return this.cCustomerService.remove(id);
  }

}
