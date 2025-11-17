import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AUserController {
  
  @Roles(Role.ADMIN)
  @Post('users')
  createAdminUser(@Body() dto: any) { /* TODO: استدعِ UsersService لإنشاء A_User */ }

  @Roles(Role.ADMIN)
  @Post('customers')
  createCustomer(@Body() dto: any) { /* TODO: استدعِ CustomersService لإنشاء C_Customer */ }
}
