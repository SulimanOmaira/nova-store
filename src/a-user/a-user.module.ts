import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CCustomerModule } from 'src/c-customer/c-customer.module';
import { AUserController } from './a-user.controller';


@Module({
  imports: [AuthModule, CCustomerModule],
  controllers: [AUserController],
})
export class AUserModule {}