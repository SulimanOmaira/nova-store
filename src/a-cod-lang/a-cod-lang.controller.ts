import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ACodLangService } from './a-cod-lang.service';
import { CreateACodLangDto } from './dto/create-a-cod-lang.dto';
import { UpdateACodLangDto } from './dto/update-a-cod-lang.dto';
import { Role } from 'src/auth/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('cod-lang')
export class ACodLangController {
  constructor(private readonly aCodLangService: ACodLangService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  // @Post('create')
  // create(@Body() createACodLangDto: CreateACodLangDto) {
  //   return this.aCodLangService.create(createACodLangDto);
  // }

  @Get('all')
  findAll() {
    return this.aCodLangService.findAll();
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.aCodLangService.findOne(id);
  }
                                                                                    
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  // @Patch('update/:id')
  // update(@Param('id') id: string, @Body() updateACodLangDto: UpdateACodLangDto) {
  //   return this.aCodLangService.update(+id, updateACodLangDto);
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  // @Delete('delete/:id')
  // remove(@Param('id') id: string) {
  //   return this.aCodLangService.remove(id);
  // }
}
