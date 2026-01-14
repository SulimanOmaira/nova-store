import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { AdminComplaintsController } from './admin-complaints.controller';
import { C_Customer } from 'src/c-customer/entities/c-customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint, C_Customer]),
  ],
  controllers: [ComplaintsController, AdminComplaintsController],
  providers: [ComplaintsService],
})
export class ComplaintsModule {}
