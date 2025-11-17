import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUCodCityDto } from './dto/create-u-cod-city.dto';
import { UpdateUCodCityDto } from './dto/update-u-cod-city.dto';
import { UCodCity } from './entities/u-cod-city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UCodCityService {
    constructor(
    @InjectRepository(UCodCity)
    private readonly cities: Repository<UCodCity>,
  ) {}

  async create(dto: CreateUCodCityDto , userID: string) {
    const exists = await this.cities.findOne({ 
      where: [
      {Ar_Name: dto.Ar_Name},
      {En_Name: dto.En_Name} 
    ]
  });
    if (exists) throw new BadRequestException('common.errors.USERNAME_ALREADY_EXISTS');
    
    const admin = this.cities.create({ Ar_Name: dto.Ar_Name,  En_Name: dto.En_Name , Created_At: new Date(), Created_By: userID});

    await this.cities.save(admin);
    return;
  }

  async findAll() {
    const list = await this.cities.find({
      order: { Id: 'DESC' },
    });
    return {
      data: list
    };
  }

  async findOne(id: string) {
    const city = await this.cities.findOne({
      where: { Id: id as any },
    });
    if (!city) {
      throw new NotFoundException('common.errors.CUSTOMER_NOT_FOUND');
    }
    return {
      data:city,
    };
  }

  async remove(id: string) {
    const customer = await this.cities.findOne({ where: { Id: id as any } });

    if (!customer) {
      throw new BadRequestException('common.errors.CUSTOMER_NOT_FOUND');
    }
    
    try {
      await this.cities.delete(id);
      return;
    } catch (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new BadRequestException('common.errors.CUSTOMER_HAS_RELATIONS');
      }
      console.error('DELETE ERROR:', err);
      throw new BadRequestException('common.errors.DB_WRITE_ERROR');
    }
  }
}
