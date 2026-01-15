import { Controller, Post, Body, UseGuards, Get, Query, Req, Param, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { AUserService } from './a-user.service';
import { UpdateAUserDto } from './dto/update-a-user.dto';
// import { CreateAUserDto } from './dto/create-a-user.dto';

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('profile')
  getMyProfile(@Req() req) {
    return this.admin.getMyProfileFromToken(req.user.userId);
  }



 @Roles(Role.SUPER_ADMIN)
  @Patch('update/:id')
  updateAdmin(
    @Param('id') id: string,
    @Body() dto: UpdateAUserDto,
    @Req() req: any,
  ) {
    // أنت عندك req.user.userId (حسب كودك)
    return this.admin.update(id, dto, req.user.userId);
  }

@Roles(Role.SUPER_ADMIN)
@Delete('delete/:id')
deleteAdmin(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.admin.deleteAdminBySuperAdmin(id, req.user.userId);
}


  // @Roles(Role.SUPER_ADMIN)
  // @Roles(Role.ADMIN)
  // @Post('customers')
  // createCustomer(@Body() dto: any) { /* TODO: استدعِ CustomersService لإنشاء C_Customer */ }
}
