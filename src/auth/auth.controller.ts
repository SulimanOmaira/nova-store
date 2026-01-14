import { Controller, Post, UseGuards, Req, Body, Delete, Get, Param, Patch, Query, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAUserDto } from 'src/a-user/dto/create-a-user.dto';
import { CreateCCustomerDto } from 'src/c-customer/dto/create-c-customer.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { UpdateCCustomerDto } from 'src/c-customer/dto/update-c-customer.dto';
import { CreateSuperAdminDto } from 'src/a-user/dto/create_super_admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  // ✅ Bootstrap لأول Super Admin (مرة واحدة فقط)
// @Post('super-admin/bootstrap')
//   async bootstrapSuperAdmin(@Body() dto: CreateSuperAdminDto) {
//   // return this.auth.bootstrapFirstSuperAdmin(dto);

//   return this.auth.createSuperAdmin(dto);
// }

// // ✅ إنشاء Super Admin جديد (فقط Super Admin)
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.SUPER_ADMIN)
// @Post('super-admin')
// createSuperAdmin(@Req() req, @Body() dto: CreateSuperAdminDto) {
//   return this.auth.createSuperAdmin(dto);
// }


  @UseGuards(AuthGuard('admin-local'))
  @Post('admin/login')
  async adminLogin(@Req() req, @Body('deviceToken') deviceToken?: string) {
    return this.auth.loginAdmin(req.user, deviceToken);
  }

  @UseGuards(AuthGuard('customer-local'))
  @Post('customer/login')
  async customerLogin(@Req() req, @Body('deviceToken') deviceToken?: string) {
    return this.auth.loginCustomer(req.user, deviceToken);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Post('admin/logout')
async adminLogout(@Req() req) {
  const adminId = req.user.userId;
  const token = req.headers.authorization?.replace('Bearer ', '');
  return this.auth.logoutAdmin(adminId, token);
}
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CUSTOMER)
@Post('customer/logout')
async customerLogout(@Req() req) {
  const customerId = req.user.userId;
  const token = req.headers.authorization?.replace('Bearer ', '');
  return this.auth.logoutCustomer(customerId, token);
}



  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
    @Post('admin/register')
  adminRegister(@Body() dto: CreateAUserDto) {
    return this.auth.registerAdmin(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('customer/register')
  customerRegister(@Req() req, @Body() dto: CreateCCustomerDto) {
    const adminID = req.user.userId;
    console.log(adminID);
    return this.auth.registerCustomer(dto, adminID);
  }

   @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('customers')
  listCustomers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    return this.auth.listCustomers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      includeDeleted: includeDeleted === 'true',
    });
  }

  // ✅ Get one customer
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('customers/:id')
  getCustomer(@Param('id') id: string) {
    return this.auth.getCustomer(Number(id));
  }

  // ✅ Update customer
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('customers/:id')
  updateCustomer(@Req() req, @Param('id') id: string, @Body() dto: UpdateCCustomerDto) {
    const adminId = req.user.userId;
    return this.auth.updateCustomer(Number(id), dto, adminId);
  }

  // ✅ Soft delete customer
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('customers/:id')
  deleteCustomer(@Req() req, @Param('id') id: string) {
    const adminId = req.user.userId;
    return this.auth.deleteCustomer(Number(id), adminId);
  }

  // ✅ Change customer password (endpoint منفصل)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('customers/:id/change-password')
  changeCustomerPassword(
    @Req() req,
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ) {
    const adminId = req.user.userId;
    return this.auth.changeCustomerPassword(Number(id), newPassword, adminId);
  }

}
