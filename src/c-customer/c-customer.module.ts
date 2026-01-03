import { Module } from '@nestjs/common';
import { CCustomerService } from './c-customer.service';
import { CCustomerController } from './c-customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { C_Customer } from './entities/c-customer.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([C_Customer]),
  ],
  controllers: [CCustomerController],
  providers: [CCustomerService],
  exports: [CCustomerService],
  
})
export class CCustomerModule {}
