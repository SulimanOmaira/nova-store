import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ASessionService } from './a-session.service';
import { CreateASessionDto } from './dto/create-a-session.dto';
import { UpdateASessionDto } from './dto/update-a-session.dto';

@Controller('a-session')
export class ASessionController {
  constructor(private readonly aSessionService: ASessionService) {}

  // @Post()
  // create(@Body() createASessionDto: CreateASessionDto) {
  //   return this.aSessionService.create(createASessionDto);
  // }

  // @Get()
  // findAll() {
  //   return this.aSessionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.aSessionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateASessionDto: UpdateASessionDto) {
  //   return this.aSessionService.update(+id, updateASessionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.aSessionService.remove(+id);
  // }
}
