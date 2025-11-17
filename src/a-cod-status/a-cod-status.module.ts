import { Module } from '@nestjs/common';
import { ACodStatusService } from './a-cod-status.service';
import { ACodStatusController } from './a-cod-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ACodStatus } from './entities/a-cod-status.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([ACodStatus]),
  ],
  controllers: [ACodStatusController],
  providers: [ACodStatusService],
  exports:[ACodStatusService],
})
export class ACodStatusModule {}
