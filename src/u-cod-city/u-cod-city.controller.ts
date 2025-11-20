import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UCodCityService } from './u-cod-city.service';
import { CreateUCodCityDto } from './dto/create-u-cod-city.dto';
import { UpdateUCodCityDto } from './dto/update-u-cod-city.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('cod-city')
export class UCodCityController {
  constructor(private readonly uCodCityService: UCodCityService) {}
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('create')
  create(@Req() req ,@Body() createUCodCityDto: CreateUCodCityDto) {
    const userID = req.user.userId;
    return this.uCodCityService.create(createUCodCityDto, userID);
  }

  @Get('all')
  findAll() {
    return this.uCodCityService.findAll();
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.uCodCityService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('update/:id')
  update(@Param('id') id: string,@Req() req,@Body() updateUCodCityDto: UpdateUCodCityDto) {
      const userID = req.user.userID;
    return this.uCodCityService.update(id, userID, updateUCodCityDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.uCodCityService.remove(id);
  }
}
