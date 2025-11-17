import { PartialType } from '@nestjs/mapped-types';
import { CreateUCodCityDto } from './create-u-cod-city.dto';

export class UpdateUCodCityDto extends PartialType(CreateUCodCityDto) {}
