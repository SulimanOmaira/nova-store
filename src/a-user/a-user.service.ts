import { Injectable } from '@nestjs/common';
import { CreateAUserDto } from './dto/create-a-user.dto';
import { UpdateAUserDto } from './dto/update-a-user.dto';

@Injectable()
export class AUserService {
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
}
