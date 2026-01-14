import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CCustomerModule } from 'src/c-customer/c-customer.module';
import { AUserController } from './a-user.controller';
import { AUserService } from './a-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { C_Customer } from 'src/c-customer/entities/c-customer.entity';
import { AUser } from './entities/a-user.entity';


@Module({
  imports: [AuthModule, CCustomerModule, 
    TypeOrmModule.forFeature([AUser, C_Customer]),
  ],
  controllers: [AUserController],
  providers: [AUserService],
  exports: [AUserService], 
})
export class AUserModule {}