import { Module } from '@nestjs/common';
import { CCustomerService } from './c-customer.service';
import { CCustomerController } from './c-customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CCustomer } from './entities/c-customer.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([CCustomer]),
  ],
  controllers: [CCustomerController],
  providers: [CCustomerService],
  exports: [CCustomerService],
  
})
export class CCustomerModule {}
