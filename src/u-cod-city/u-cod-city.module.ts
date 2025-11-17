import { Module } from '@nestjs/common';
import { UCodCityService } from './u-cod-city.service';
import { UCodCityController } from './u-cod-city.controller';
import { UCodCity } from './entities/u-cod-city.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([UCodCity]),
  ],
  controllers: [UCodCityController],
  providers: [UCodCityService],
  exports:[UCodCityService]
})
export class UCodCityModule {}
