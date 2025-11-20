import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ACodStatusService } from './a-cod-status.service';
import { CreateACodStatusDto } from './dto/create-a-cod-status.dto';
import { UpdateACodStatusDto } from './dto/update-a-cod-status.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('cod-status')
export class ACodStatusController {
  constructor(private readonly aCodStatusService: ACodStatusService) {}
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('create')
  create(@Req() req ,@Body() createACodStatusDto: CreateACodStatusDto) {
    const userID = req.user.userId;
    return this.aCodStatusService.create(createACodStatusDto, userID);
  }

  @Get('all')
  findAll() {
    return this.aCodStatusService.findAll();
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.aCodStatusService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateACodStatusDto: UpdateACodStatusDto) {
  //   return this.aCodStatusService.update(+id, updateACodStatusDto);
  // }
  // @UseGuards(JwtAuthGuard,RolesGuard)
  // @Roles(Role.ADMIN)
  // @Delete('delete/:id')
  // remove(@Param('id') id: string) {
  //   return this.aCodStatusService.update(id);
  // }
}
