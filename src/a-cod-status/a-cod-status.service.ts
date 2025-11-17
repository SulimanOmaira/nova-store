import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateACodStatusDto } from './dto/create-a-cod-status.dto';
import { UpdateACodStatusDto } from './dto/update-a-cod-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ACodStatus } from './entities/a-cod-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ACodStatusService {
    constructor(
    @InjectRepository(ACodStatus)
    private readonly status: Repository<ACodStatus>,
  ) {}

  async create(dto: CreateACodStatusDto , userID: string) {
    const exists = await this.status.findOne({ 
      where: [
      {Ar_Name: dto.Ar_Name},
      {En_Name: dto.En_Name} 
    ]
  });
    if (exists) throw new BadRequestException('common.errors.USERNAME_ALREADY_EXISTS');
    
    const admin = this.status.create({ Ar_Name: dto.Ar_Name,  En_Name: dto.En_Name});

    await this.status.save(admin);
    return;
  }

  async findAll() {
    const list = await this.status.find({
      order: { Id: 'DESC' },
    });
    return {
      data: list
    };
  }

  async findOne(id: string) {
    const city = await this.status.findOne({
      where: { Id: id as any },
    });
    if (!city) {
      throw new NotFoundException('common.errors.CUSTOMER_NOT_FOUND');
    }
    return {
      data:city,
    };
  }

  // update(id: string, updateACodStatusDto: UpdateACodStatusDto) {
  //   return `This action updates a #${id} aCodStatus`;
  // }

  // async remove(id: string) {
  //   const customer = await this.status.findOne({ where: { Id: id as any } });

  //   if (!customer) {
  //     throw new BadRequestException('common.errors.CUSTOMER_NOT_FOUND');
  //   }
    
  //   try {
  //     await this.status.delete(id);
  //     return;
  //   } catch (err) {
  //     if (err.code === 'ER_ROW_IS_REFERENCED_2') {
  //       throw new BadRequestException('common.errors.CUSTOMER_HAS_RELATIONS');
  //     }
  //     console.error('DELETE ERROR:', err);
  //     throw new BadRequestException('common.errors.DB_WRITE_ERROR');
  //   }
  // }
}
