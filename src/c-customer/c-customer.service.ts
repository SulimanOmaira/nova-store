import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCCustomerDto } from './dto/create-c-customer.dto';
import { UpdateCCustomerDto } from './dto/update-c-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CCustomer } from './entities/c-customer.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class CCustomerService {

    constructor(
    @InjectRepository(CCustomer)
    private readonly customers: Repository<CCustomer>,
  ) {}

  async findAll() {
    const list = await this.customers.find({
      order: { Id: 'DESC' },
    });
    return {
      data: list
    };
  }

  async findOne(id: string) {
    const customer = await this.customers.findOne({
      where: { Id: id as any },
    });
    if (!customer) {
      throw new NotFoundException('common.errors.CUSTOMER_NOT_FOUND');
    }
    return {
      data:customer,
    };
  }

 async update(id: string, dto: UpdateCCustomerDto) {
    const customer = await this.customers.findOne({ where: { Id: id as any } });
    
    if (!customer) {
      throw new NotFoundException('common.errors.CUSTOMER_NOT_FOUND');
    }

    if (dto.Phone_Number && dto.Phone_Number !== customer.Phone_Number) {
      const existsPhone = await this.customers.findOne({
        where: { Phone_Number: dto.Phone_Number },
      });

      if (existsPhone) {
        throw new BadRequestException('common.errors.PHONE_ALREADY_EXISTS');
      }
    }
    
    if (dto.Password) {
      customer.Password = await bcrypt.hash(dto.Password, 10);
    }

    if (dto.F_Name !== undefined) customer.F_Name = dto.F_Name;
    if (dto.M_Name !== undefined) customer.M_Name = dto.M_Name;
    if (dto.L_Name !== undefined) customer.L_Name = dto.L_Name;
    if (dto.Phone_Number !== undefined) customer.Phone_Number = dto.Phone_Number;
    if (dto.Adress !== undefined) customer.Adress = dto.Adress;
    if (dto.City_Id !== undefined) customer.City_Id = dto.City_Id;
    if (dto.Lang_Id !== undefined) customer.Lang_Id = dto.Lang_Id;
    if (dto.Status_Id !== undefined) customer.Status_Id = dto.Status_Id;
    if (dto.Image_Base64 !== undefined) customer.Image_Base64 = dto.Image_Base64;

    customer.Updated_At = new Date();
    
    await this.customers.save(customer);
    
    return {
      code: 'CUSTOMER_UPDATED',
      data: customer,
    };
  }

  async remove(id: string) {
    const customer = await this.customers.findOne({ where: { Id: id as any } });

    if (!customer) {
      throw new BadRequestException('CUSTOMER_NOT_FOUND');
    }
    
    try {
      await this.customers.delete(id);
      return {
        code: 'CUSTOMER_DELETED',
        data: { id },
      };
    } catch (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new BadRequestException('CUSTOMER_HAS_RELATIONS');
      }
      console.error('DELETE ERROR:', err);
      throw new BadRequestException('DB_WRITE_ERROR');
    }
  }
}
