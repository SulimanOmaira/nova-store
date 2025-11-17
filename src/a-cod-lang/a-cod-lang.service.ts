import { BadRequestException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateACodLangDto } from './dto/create-a-cod-lang.dto';
import { UpdateACodLangDto } from './dto/update-a-cod-lang.dto';
import { ACodLang } from './entities/a-cod-lang.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ACodLangService {
    constructor(
    @InjectRepository(ACodLang)
    private readonly lang: Repository<ACodLang>,
  ) {}
  
  async create(dto: CreateACodLangDto) {
    const exists = await this.lang.findOne({ 
      where: [
      {Ar_Name: dto.Ar_Name},
      { En_Name: dto.En_Name} 
    ]
  });
    if (exists) throw new BadRequestException('common.errors.USERNAME_ALREADY_EXISTS');
    
    const admin = this.lang.create({ Ar_Name: dto.Ar_Name,  En_Name: dto.En_Name});

    await this.lang.save(admin);
    return;
  }

  async findAll() {
    const list = await this.lang.find({
      order: { Id: 'DESC' },
    });
    return {
      data: list
    };
  }

  async findOne(id: string) {
    const lang = await this.lang.findOne({
      where: { Id: id as any },
    });
    if (!lang) {
      throw new NotFoundException('common.errors.CUSTOMER_NOT_FOUND');
    }
    return {
      data:lang,
    };
  }

  async remove(id: string) {
    const customer = await this.lang.findOne({ where: { Id: id as any } });

    if (!customer) {
      throw new BadRequestException('common.errors.CUSTOMER_NOT_FOUND');
    }
    
    try {
      await this.lang.delete(id);
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
