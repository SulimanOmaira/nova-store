import { Module } from '@nestjs/common';
import { ACodLangService } from './a-cod-lang.service';
import { ACodLangController } from './a-cod-lang.controller';
import { ACodLang } from './entities/a-cod-lang.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([ACodLang]),
  ],
  controllers: [ACodLangController],
  providers: [ACodLangService],
    exports: [ACodLangService],
  
})
export class ACodLangModule {}
