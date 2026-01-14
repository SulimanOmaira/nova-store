import { Injectable } from '@nestjs/common';
import { CreateAUserDto } from './dto/create-a-user.dto';
import { UpdateAUserDto } from './dto/update-a-user.dto';
import { In, Repository } from 'typeorm';
import { AUser } from './entities/a-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/role.enum';
import { C_Customer } from 'src/c-customer/entities/c-customer.entity';

@Injectable()
export class AUserService {

constructor(
    @InjectRepository(AUser) private admin: Repository<AUser>,
    @InjectRepository(C_Customer) private customers: Repository<C_Customer>,
    
){}

  create(createAUserDto: CreateAUserDto) {
    return 'This action adds a new aUser';
  }

  findAll() {
    return `This action returns all aUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aUser`;
  }

  update(id: number, updateAUserDto: UpdateAUserDto) {
    return `This action updates a #${id} aUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} aUser`;
  }

async listAllAdmins() {
  const admins = await this.admin.find({
    where: { Role: In([Role.ADMIN]) } as any,
    order: { Id: 'DESC' as any },
  });

  return {
    data: admins.map((u) => ({
      id: u.Id,
      username: u.UserName,
      firstName: u.F_Name,
      middleName: u.M_Name,
      lastName: u.L_Name,
      phone: u.Phone_Number,
      role: u.Role,
      statusId: u.Status_Id,
      createdAt: u.Created_At,
      updatedAt: u.Updated_At,
    })),
  };
}

async listAllCustomersWithStores(includeDeleted = false) {
  const where: any = {};
  if (!includeDeleted) where.isDeleted = false;

  const customers = await this.customers.find({
    where,
    relations: { store: true },
    order: { Id: 'DESC' as any },
  });

  return {
    data: customers.map((c) => ({
      id: c.Id,
      username: c.Username,
      firstName: c.F_Name,
      middleName: c.M_Name,
      lastName: c.L_Name,
      phone: c.Phone_Number,
      isDeleted: c.isDeleted,
      cityId: c.City_Id,
      statusId: c.Status_Id,
      address: c.Adress,
      storeId: c.storeId,
      storeName: c.store?.name ?? null,
      store: c.store
        ? {
            id: c.store.id,
            name: c.store.name,
            address: (c.store as any).address ?? null,
            status: (c.store as any).status ?? null,
            logo: c.store.logo,
            isDeleted: c.store.isDeleted,

          }
        : null,
    })),
  };
}
}
