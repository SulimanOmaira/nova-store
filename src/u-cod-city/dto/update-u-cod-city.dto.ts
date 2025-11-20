import { PartialType } from '@nestjs/mapped-types';
import { CreateUCodCityDto } from './create-u-cod-city.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUCodCityDto extends PartialType(CreateUCodCityDto) {
    
        @IsString()
        @IsNotEmpty()
        Ar_Name: string;
    
        @IsString()
        @IsNotEmpty()
        En_Name: string;

        @IsOptional()
        @IsString()
        Updated_By?:string
    
        @IsOptional()
        @IsString()
        Updated_At?:Date
}
