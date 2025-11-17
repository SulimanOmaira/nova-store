import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAUserDto } from 'src/a-user/dto/create-a-user.dto';
import { CreateCCustomerDto } from 'src/c-customer/dto/create-c-customer.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

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
}
