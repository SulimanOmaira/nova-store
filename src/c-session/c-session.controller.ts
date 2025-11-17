import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CSessionService } from './c-session.service';
import { CreateCSessionDto } from './dto/create-c-session.dto';
import { UpdateCSessionDto } from './dto/update-c-session.dto';

@Controller('c-session')
export class CSessionController {
  constructor(private readonly cSessionService: CSessionService) {}

  // @Post()
  // create(@Body() createCSessionDto: CreateCSessionDto) {
  //   return this.cSessionService.create(createCSessionDto);
  // }

  // @Get()
  // findAll() {
  //   return this.cSessionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cSessionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCSessionDto: UpdateCSessionDto) {
  //   return this.cSessionService.update(+id, updateCSessionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cSessionService.remove(+id);
  // }
}
