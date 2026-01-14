import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { AUserService } from './a-user.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AUserController {
  constructor(private admin: AUserService){}
  
  @Roles(Role.ADMIN)
  @Post('users')
  createAdminUser(@Body() dto: any) { /* TODO: استدعِ UsersService لإنشاء A_User */ }

  @Get('admins/all')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
listAllAdmins() {
  return this.admin.listAllAdmins();
}

@Get('customers/all')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
listAllCustomers(@Query('includeDeleted') includeDeleted?: string) {
  return this.admin.listAllCustomersWithStores(includeDeleted === 'true');
}



  // @Roles(Role.SUPER_ADMIN)
  // @Roles(Role.ADMIN)
  // @Post('customers')
  // createCustomer(@Body() dto: any) { /* TODO: استدعِ CustomersService لإنشاء C_Customer */ }
}
